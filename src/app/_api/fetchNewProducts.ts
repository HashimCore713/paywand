import { NEW_PRODUCTS } from '../_graphql/products';
import { GRAPHQL_API_URL } from './shared';

export const fetchNewProducts = async () => {
  const response = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: NEW_PRODUCTS }),
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(`GraphQL Error: ${errors[0].message}`);
  }

  return data;
};
