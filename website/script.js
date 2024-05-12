const params = window.location.search

const parsedParams = new URLSearchParams(params)

const channel = parsedParams.get("channel")

const button = document.getElementById("open-button")

if (channel) {
  window.location.replace(`draw://channel/${channel}`)
  button.setAttribute("href", `draw://channel/${channel}`)
}
