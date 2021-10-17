from typing import List
from graphql import GraphQLResolveInfo

import frappe
from frappe.model.db_query import DatabaseQuery
from frappe_graphql import CursorPaginator


def search_books_resolver(obj, info: GraphQLResolveInfo, **kwargs):
    return CursorPaginator(
        doctype="Book",
        count_resolver=search_books_count_resolver,
        node_resolver=search_books_node_resolver,
    ).resolve(obj, info, **kwargs)


def search_books_count_resolver(paginator: CursorPaginator, filters):
    filters, table_filters = get_table_filters(filters)

    conditions = [
        DatabaseQuery(paginator.doctype).prepare_filter_condition(f)
        for f in filters or []]

    joins, conditions = get_table_joins(table_filters, conditions)

    return frappe.db.sql(f"""
        SELECT COUNT(*) as _count
        FROM
            `tabBook`
            {" ".join(joins)}
        {" WHERE {}".format(" AND ".join(conditions)) if len(conditions) else ""}
        """, debug=0)[0][0]


def search_books_node_resolver(
        paginator: CursorPaginator,
        filters,
        sorting_fields,
        sort_dir,
        limit):

    filters, table_filters = get_table_filters(filters)

    # filters could probably have pagination queries
    conditions = [  # .replace(F"`tab{paginator.doctype}`.", "")
        DatabaseQuery(paginator.doctype).prepare_filter_condition(f)
        if not isinstance(f, str) else f
        for f in filters or []]

    joins, conditions = get_table_joins(table_filters, conditions)

    return frappe.db.sql(
        f"""
        SELECT
            `tabBook`.name, SUBSTR(".{paginator.doctype}", 2) as doctype,
            {", ".join(["`tabBook`." + x for x in sorting_fields])}
        FROM
            `tabBook`
            {" ".join(joins)}
        {" WHERE {}".format(" AND ".join(conditions)) if len(conditions) else ""}
        ORDER BY {', '.join([f'`tabBook`.{x} {sort_dir}' for x in sorting_fields])}
        LIMIT {limit}
        """, as_dict=1, debug=0
    )


def get_table_filters(filters: List):
    """
    Extracts book_category and age_group outside
    Since they are of type TableMultiSelect
    """
    table_filters = frappe._dict()
    _filters = list(filters)
    for df in ["book_category", "age_group"]:
        _filter = [x for x in filters if x[0] == df]
        if not len(_filter):
            continue

        table_filters[df] = _filter[0][-1]
        _filters.remove(_filter[0])

    return _filters, table_filters


def get_table_joins(table_filters, conditions):
    joins = []
    dt_map = {
        "book_category": "Book Category Item",
        "age_group": "Book Age Group Item"
    }
    for df in ["book_category", "age_group"]:
        if df not in table_filters:
            continue
        dt = dt_map[df]
        joins.append(f"LEFT JOIN `tab{dt}` ON `tab{dt}`.parent = `tabBook`.name")
        conditions.append(f"`tab{dt}`.{df} = '{table_filters[df]}'")

    return joins, conditions
