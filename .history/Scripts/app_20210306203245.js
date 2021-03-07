/* custom JavaScript goes here */

//IIFE - Immediately Invoked Function Expression
//AKA - Anonymous Self-Executing Function
//Closure - limits scope leak

"use strict";

((core) =>
{
    /**
     * Inject the Navigation bar into the Header element and highlight the active link based on the pageName parameter
     *
     * @param {string} pageName
     */
    function loadHeader(pageName)
    {
        console.log(location.pathname);
        // inject the Header
      $.get("./Views/components/header.html", function(data)
      {
        $("header").html(data); // load the navigation bar
        $(`#${pageName}`).addClass("active"); // highlight active link

        // loop through each anchor tag in the unordered list and 
        // add an event listener / handler to allow for 
        // content injection
        $("a").on("click", function()
        {
          $(`#${activeLink}`).removeClass("active"); // removes highlighted link
          activeLink = $(this).attr("id");
          loadContent(activeLink);
          $(`#${activeLink}`).addClass("active"); // applies highlighted link to new page

          console.log(activeLink);
          history.pushState({},"", activeLink); // this replaces the url displayed in the browser
          //location.href = String( location.href ).replace( /#/, "" ); // remove # ? nope
        });

        // make it look like each nav item is an active link
        $("a").on("mouseover", function()
        {
          $(this).css('cursor', 'pointer');
        });

      });
    }

        /**
     * Inject page content in the main element 
     *
     * @param {string} pageName
     * @returns {void}
     */
    function loadContent(pageName)
    {
      // inject content
      $.get(`./Views/content/${pageName}.html`, function(data)
      {
        $("main").html(data);
      });
    }

    function loadFooter()
    {
      // inject the Footer
      $.get("./Views/components/footer.html", function(data)
      {
        $("footer").html(data);
      });
    }

    function displayHome()
    {
      activeLink = "home";

      loadHeader(activeLink);

      loadContent(activeLink);

      loadFooter();
        
        
    }

    function displayAbout()
    {

    }

    function displayProjects()
    {

    }

    function displayServices()
    {

    }

    function testFullName()
    {
      let messageArea = $("#messageArea").hide();
      let fullNamePattern = /([A-Z][a-z]{1,25})+(\s|,|-)([A-Z][a-z]{1,25})+(\s|,|-)*/;

        
        $("#fullName").on("blur", function()
        {
          if(!fullNamePattern.test($(this).val()))
          {
            $(this).trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Please enter a valid Full Name. This must include at least a Capitalized first name followed by a Capitlalized last name.");
          }
          else
          {
              messageArea.removeAttr("class").hide();
          }
        });
    }

    function testContactNumber()
    {
      let messageArea = $("#messageArea");
      let contactNumberPattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        
        $("#contactNumber").on("blur", function()
        {
          if(!contactNumberPattern.test($(this).val()))
          {
            $(this).trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Please enter a valid Contact Number. Country code and area code are both optional");
          }
          else
          {
              messageArea.removeAttr("class").hide();
          }
        });
    }

    function testEmailAddress()
    {
      let messageArea = $("#messageArea");
      let emailAddressPattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
        
        $("#emailAddress").on("blur", function()
        {
          if(!emailAddressPattern.test($(this).val()))
          {
            $(this).trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Please enter a valid Email Address.");
          }
          else
          {
              messageArea.removeAttr("class").hide();
          }
        });
    }

    function formValidation()
    {
      testFullName();
      testContactNumber();
      testEmailAddress();
    }

    function displayContact()
    {
      // form validation
      formValidation();

        $("#sendButton").on("click", (event)=> 
        {
          if($("#subscribeCheckbox")[0].checked)
          {
            let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);

            if(contact.serialize())
            {
              let key = contact.FullName.substring(0, 1) + Date.now();

              localStorage.setItem(key, contact.serialize());
            }
          }
        });
    }

    function displayContactList() 
    {
      if (localStorage.length > 0) 
      {

        let contactList = document.getElementById("contactList");

        let data = "";

        let keys = Object.keys(localStorage);
         
        let index = 1;

        for (const key of keys) 
        {
          let contactData = localStorage.getItem(key);

          let contact = new core.Contact();
          contact.deserialize(contactData);

          data += `<tr>
          <th scope="row" class="text-center">${index}</th>
          <td>${contact.FullName}</td>
          <td>${contact.ContactNumber}</td>
          <td>${contact.EmailAddress}</td>
          <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
          <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
          </tr>`;

          index++;
        }

        contactList.innerHTML = data;

        $("button.edit").on("click", function(){
          location.href = "edit.html#" + $(this).val();
         });

         $("button.delete").on("click", function(){
           if(confirm("Are you sure?"))
           {
            localStorage.removeItem($(this).val());
           }
           location.href = "contact-list.html"; // refresh the page
         });

         $("#addButton").on("click", function() 
         {
          location.href = "edit.html";
         });
      }
    }

    function displayEdit()
    {
      let key = location.hash.substring(1);

      let contact = new core.Contact();

      // check to ensure that the key is not empty
      if(key != "")
      {
        // get contact info from localStorage
        contact.deserialize(localStorage.getItem(key));

        // display contact information in the form
        $("#fullName").val(contact.FullName);
        $("#contactNumber").val(contact.ContactNumber);
        $("#emailAddress").val(contact.EmailAddress);
      }
      else
      {
        // modify the page so that it shows "Add Contact" in the header 
        $("main>h1").text("Add Contact");
        // modify edit button so that it shows "Add" as well as the appropriate icon
        $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);
      }

      // form validation
      formValidation();
      
     $("#editButton").on("click", function() 
        {
            // check to see if key is empty
          if(key == "")
          {
            // create a new key
            key = contact.FullName.substring(0, 1) + Date.now();
          }

          // copy contact info from form to contact object
          contact.FullName = $("#fullName").val();
          contact.ContactNumber = $("#contactNumber").val();
          contact.EmailAddress = $("#emailAddress").val();

          // add the contact info to localStorage
          localStorage.setItem(key, contact.serialize());

          // return to the contact list
          location.href = "contact-list.html";
          
        });
   

      $("#cancelButton").on("click", function()
      {
        // return to the contact list
        location.href = "contact-list.html";
      });
    }

    function displayLogin()
    {
      let messageArea = $("#messageArea");
      messageArea.hide();

      $("#loginButton").on("click", function() 
      {
        let username = $("#username");
        let password = $("#password");
        let success = false;
        let newUser = new core.User();

        // use ajax to access the json file
        $.get("./Data/users.json", function(data)
        {
          // check each user in the users.json file  (linear search)
          for (const user of data.users) 
          {
            if(username.val() == user.Username && password.val() == user.Password)
            {
              newUser.fromJSON(user);
              success = true;
              break;
            }
          }

          // if username and password matches - success... then perform login
          if(success)
          {
            // add user to session storage
            sessionStorage.setItem("user", newUser.serialize());

            // hide any error message
            messageArea.removeAttr("class").hide();

            // redirect user to secure area - contact-list.html
            location.href = "contact-list.html";
          }
          else
          {
            // display an error message
            username.trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Error: Invalid login information");
          }
        });
      });

      $("#cancelButton").on("click", function()
      {
        // clear the login form
        document.forms[0].reset();
        // return to the home page
        location.href = "index.html";
      });
    }

    function displayRegister()
    {

    }

    function toggleLogin()
    {
      // if user is logged in
      if(sessionStorage.getItem("user"))
      {
        // swap out the login link for logout
        $("#login").html(
        `<a id="logout" class="nav-link" aria-current="page" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
        );

        $("#logout").on("click", function()
        {
          // perform logout
          sessionStorage.clear();

          // redirect back to login
          location.href = "login.html";
        });
       
        $(`<li class="nav-item">
        <a id="contactListLink" class="nav-link" aria-current="page" href="contact-list.html"><i class="fas fa-users fa-lg"></i> Contact List</a>
      </li>`).insertBefore("#login");
      
      }
    }

    function Start()
    {
        console.log("App Started...");

        switch (document.title) 
        {
          case "Home":
              displayHome();
            break;
          case "About":
              displayAbout();
            break;
          case "Projects":
              displayProjects();
            break;
          case "Services":
              displayServices();
            break;
          case "Contact":
              displayContact();
            break;
          case "Contact-List":
            displayContactList();
            break;
          case "Edit":
            displayEdit();
            break;
          case "Login":
            displayLogin();
          break;
          case "Register":
            displayRegister();
          break;
        }

        // toggle login/logout
       toggleLogin();
        
    }

    window.addEventListener("load", Start);

    core.Start = Start;

})(core || (core={}));