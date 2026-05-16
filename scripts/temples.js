const today = document.getElementById("lastModified").innerHTML = document.lastModified;
const year = document.getElementById("currentyear").textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
    menuButton.classList.toggle("open");
});