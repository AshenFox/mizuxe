import $ from "jquery";
import "bootstrap";
import "bootstrap/scss/bootstrap.scss";
import "./css/main.scss";

$("#year").text(new Date().getFullYear());

$("body").scrollspy({ target: "#main-nav" });

$("#main-nav a").on("click", function (e) {
  console.log(this);
  if (this.hash !== "") {
    e.preventDefault();

    const hash = this.hash;

    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top,
      },
      800,
      () => {
        window.location.hash = hash;
      }
    );
  }
});
