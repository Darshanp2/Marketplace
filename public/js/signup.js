/*(function ($) {
  $("#signup-form").submit(function (event) {
    $("#signupError").empty();
    $("#signupError").hide();

    let name = $("#name").val().trim();
    let address = $("#address").val();

    let password = $("#password").val().trim();
    let phone = $("#phoneNumber").val().trim();

    let email = $("#email").val().trim();

    let error = false;
    let message = null;

    if (!name || !address || !password || !email || !phone) {
      error = true;
      message = "Error: All fields should be supplied.";
    }
    for (let i of password)
      if (i == " ") {
        error = true;
        message = "password has empty spaces";
      }
    const phoneNoCheck = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
    const phoneCheck = phoneNoCheck.test(phoneNumber);
    if (phoneCheck == false) {
      error = true;
      message = "Wrong Phone no. format";
    }

    if (!error && email && name && password)
      if (name.length < 4) {
        error = true;
        message = "Name has less than 4 characters";
      }

    let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
    if (!name.match(nameCheck)) {
      error = true;
      message = "Name is not a valid input";
    }

    /*let emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    ///(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!email.match(emailCheck)) {
      throw `Email is not valid `;
    }
    if (!error && password.length < 6) {
      error = true;
      message = "Error: The length of password should between 4 and";
    }

    const emailPattern =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!error && !emailPattern.test(email)) {
      error = true;
      message = "Error: Invaild email address.";
    }

    console.log(error);

    if (error) {
      event.preventDefault();
      let htmlStr = `<p class = "signError">${message}</p>`;
      $("#signupError").append(htmlStr);
      $("#signupError").show();
    }
  });
})(jQuery);
*/

$(function () {
  let name = $("#name");
  let address = $("#address");

  let password = $("#password");

  let email = $("#email");

  let phoneNumber = $("#phoneNumber");
  let myForm = $("#signup-form");

  let error = $("#error");
  let errorList = $("#errorList");
  error.hide();

  if (myForm) {
    myForm.submit(function (event) {
      event.preventDefault();
      var email_term = email.val();
      var password_term = password.val().trim();
      var name1 = name.val();
      var address1 = address.val();

      let phoneNumber_term = phoneNumber.val();

      errorList.empty();
      error.hide();
      if (!name || phoneNumber_term.trim() === "") {
        errorList.append(`<li>Enter Name</li>`);
        error.show();
      } else if (name1.length < 4) {
        errorList.append(`<li>Minimuin name characters are 4</li>`);
        error.show();
      }
      /*else if (!name1.match(nameCheck)) {
        errorList.append(`<li>Incorrect name type</li>`);
        error.show();
      }*/

      //let nameCheck =
      // /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;

      if (!address1 || address1.trim() === "") {
        errorList.append(`<li>Provide address</li>`);
        error.show();
      }
      let check0 = phoneNumber_term;
      let result = check0.slice(0, 1);
      if (result == 0) {
        errorList.append(`<li>First digit of Phone no. cannot be 0</li>`);
        error.show();
      }
      function validatePhoneNumber(phoneNumber) {
        const re = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
        return re.test(String(phoneNumber));
      }
      if (!phoneNumber_term || phoneNumber_term.trim() === "") {
        errorList.append(`<li>Phone Number must be provided!</li>`);
        error.show();
      } else if (!validatePhoneNumber(phoneNumber_term)) {
        errorList.append(`<li>Phone Number is in incorrect format!</li>`);
        error.show();
      }
      function validateEmail(email) {
        const re =
          /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
      if (!email_term || email_term.trim() === "") {
        errorList.append(`<li>E-Mail must be provided!</li>`);
        error.show();
      } else if (!validateEmail(email_term)) {
        errorList.append(`<li>E-Mail must be in correct format!</li>`);
        error.show();
      }
      /* if (error) {
        event.preventDefault();
      }*/
      if (!password_term || password_term.trim() === "") {
        errorList.append(`<li>Password must be provided!</li>`);
        error.show();
      }
      for (let i of password_term)
        if (i == " ") {
          errorList.append(`<li>Password has empty spaces</li>`);
          error.show();
        }
      if (password_term.length < 6) {
        errorList.append(`<li>Minimuin Password characters are 6</li>`);
        error.show();
      }

      //Phone Number

      if (error.is(":hidden")) {
        myForm.unbind().submit();
        myForm.submit();
      } else {
        $("html, body").animate({ scrollTop: 0 }, "slow");
      }
    });
  }
});
