from graphql import GraphQLSchema
from .get_doc_by_slug import get_doc_by_slug_resolver


def bind_queries(schema: GraphQLSchema):
    schema.query_type.fields["getDocBySlug"].resolve = get_doc_by_slug_resolver
