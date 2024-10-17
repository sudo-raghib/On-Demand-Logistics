export function postData(url, data, isAuth = true) {

  console.log("body", data)
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: isAuth ? `Bearer ${localStorage.getItem("token")}` : "",
    },
    body: JSON.stringify(data),
  });
}

export function getData(url, isAuth = true) {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: isAuth ? `Bearer ${localStorage.getItem("token")}` : "",
    },
  });
}

export function putData(url, data = null, isAuth = true) {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: isAuth ? `Bearer ${localStorage.getItem("token")}` : "",
    },
    body: data ? JSON.stringify(data) : null,
  });
}
