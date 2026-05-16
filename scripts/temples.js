const today = document.getElementById("lastModified").innerHTML = document.lastModified;
const year = document.getElementById("currentyear").textContent = new Date().getFullYear();

const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    menuButton.classList.toggle("open");
});