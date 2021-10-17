from graphql import GraphQLSchema
from .get_doc_by_slug import get_doc_by_slug_resolver
from .search_books import search_books_resolver


def bind_queries(schema: GraphQLSchema):
    schema.query_type.fields["getDocBySlug"].resolve = get_doc_by_slug_resolver
    schema.query_type.fields["searchBooks"].resolve = search_books_resolver
