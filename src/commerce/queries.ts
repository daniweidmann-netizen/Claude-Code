const MONEY = `amount currencyCode`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query VireliProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      featuredImage { url altText width height }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          price { ${MONEY} }
          compareAtPrice { ${MONEY} }
        }
      }
      metafields(identifiers: [
        { namespace: "vireli", key: "ingredients" }
        { namespace: "vireli", key: "nutrition_table" }
        { namespace: "vireli", key: "recommended_intake" }
        { namespace: "vireli", key: "warnings" }
        { namespace: "vireli", key: "claims_footnote" }
      ]) { key value }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { ${MONEY} } }
  lines(first: 20) {
    nodes {
      id
      quantity
      cost { totalAmount { ${MONEY} } }
      merchandise {
        ... on ProductVariant {
          id
          title
          image { url altText }
          product { title }
        }
      }
    }
  }
`;

export const CART_QUERY = `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;

export const CART_CREATE = `mutation CartCreate($lines: [CartLineInput!]) {
  cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } }
}`;

export const CART_LINES_ADD = `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
}`;

export const CART_LINES_UPDATE = `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
}`;

export const CART_LINES_REMOVE = `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } }
}`;
