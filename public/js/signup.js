
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

      var email_term = email.val();
      var password_term = password.val().trim();
      var name1 = name.val();
      var address1 = address.val();

      let phoneNumber_term = phoneNumber.val();

      let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
      let check0 = phoneNumber_term;
      let result = check0.slice(0, 1);
      

      errorList.empty();
      error.hide();
      if(!name1 || name1.trim().length == 0) errorList.append(`<li>Enter Name</li>`);
      if(!address1 || address1.trim().length == 0) errorList.append(`<li>Enter Address</li>`);
      if(!phoneNumber_term) errorList.append(`<li>Enter Phone number</li>`);
      if(!password_term || password_term.trim().length == 0) errorList.append(`<li>Enter Password</li>`);
      if(!email_term || email_term.trim().length == 0) errorList.append(`<li>Enter email </li>`);


      if(!(/[a-zA-Z0-9]/.test(name1))) errorList.append(`<li>Name should only contain numbers and alphabets</li>`);
      if(!/\d{3}-?\d{3}-?\d{4}$/.test(phoneNumber_term)) errorList.append(`<li>Incorrect Phone Number</li>`);
      if(! /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email_term.toLowerCase())) errorList.append(`<li>Incorrect Email Id</li>`);
      if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password_term)) errorList.append(`<li>Password must have one lower case,one upper case alphabets, one number and one special character</li>`);

      if(errorList.length){
        error.show()
        event.preventDefault();
      }
      })
    }
  })(jQuery);
