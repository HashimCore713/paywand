import { PRODUCTS_QUICK_CHECKOUT } from '../_graphql/products';
import { GRAPHQL_API_URL } from './shared';

export const fetchQuickCheckoutProducts = async () => {
  const response = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: PRODUCTS_QUICK_CHECKOUT }),
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(`GraphQL Error: ${errors[0].message}`);
  }

  return data.Products.docs;
};
