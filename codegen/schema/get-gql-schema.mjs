import { getIntrospectionQuery } from "graphql";

export async function getGqlSchema({ moduleName, cache, url, token }) {
  try {
    const introspectionQuery = getIntrospectionQuery();

    const response = await fetch(url, {
      method: "POST",
      headers: token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {
            "Content-Type": "application/json",
          },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const { data: schema, errors } = await response.json();

    if (errors) {
      throw new Error(errors.map((err) => "- " + err.message).join("\n"));
    }

    return { moduleName, cache, schema };
  } catch (err) {
    console.error("failed to get gql schema", err);
    throw err;
  }
}
