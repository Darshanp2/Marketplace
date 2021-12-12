jQuery(function($) {

    let myForm = $("#updateprofile").val();
    if (myForm) {
      myForm.submit(function (event) {
        let name = $("#name").val();
        let address = $("#address").val();
        let password = $("#password").val();
        let email = $("#email").val();
        let phoneNumber = $("#phoneNumber").val();


        let error = $("#error");
        let errorList = $("#errorList");
        // let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
        // let check0 = phoneNumber_term;
        // let result = check0.slice(0, 1);
        
  
        errorList.empty();
        error.hide();
        if(name &&  name.trim().length == 0) errorList.append(`<li>Enter Name</li>`);
        if(address && address.trim().length == 0) errorList.append(`<li>Enter Address</li>`);
        if(phoneNumber) errorList.append(`<li>Enter Phone number</li>`);
        if(password && password.trim().length == 0) errorList.append(`<li>Enter Password</li>`);
        if(email && email.trim().length == 0) errorList.append(`<li>Enter email </li>`);
  
  
        if(!(/[a-zA-Z0-9]/.test(name))) errorList.append(`<li>Name should only contain numbers and alphabets</li>`);
        if(!/\d{3}-?\d{3}-?\d{4}$/.test(phoneNumber)) errorList.append(`<li>Incorrect Phone Number</li>`);
        //if(! /?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]/.test(email_term)) errorList.append(`<li>Incorrect Email Id</li>`);
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) errorList.append(`<li>Password must have one lower case,one upper case alphabets, one number and one special character</li>`);
  
        if(errorList.length){
          error.show()
          event.preventDefault();
        }
        })
      }
    })