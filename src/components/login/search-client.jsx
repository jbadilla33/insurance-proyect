export default async function SearchClient({ username, password }) {
  try {
    const resp = await fetch(
      "https://asesores.segurospiramide.com/asg-api/login",
      {
        method: "POST",
        body: JSON.stringify({
          p_portal_username: username,
          p_pwd: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    var data = await resp.json();

    return data;
  } catch (error) {
    console.log("Error ejecutando el api");
  }
}
