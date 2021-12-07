// (function($) {
//     // Let's start writing AJAX calls!

//     var requestConfig = {
//         method: 'GET',
//         url: 'http://localhost:3000'
//     };
//     let login =$("form")
//     let logout= $("Log-out")
//     // let butt=$("#submit_button")
//     // let shows=$("#show")
//     // let search=$("#search_term")
//     // let backlink= $("#homeLink")



//     $.ajax(requestConfig).then(function() {
//         login.show();
//         logout.hide();
        
//     });

//     butt.click(function(event) {
//         event.preventDefault();
//         shows.empty();
//         if (search.val() === '' || !search.val().replace(/\s/g, '').length) {
//             errortag.text("Input not valid!").show();
//             list.empty();
//             backlink.show();

//         } else {

//             var searchRequest = {
//                 method: 'GET',
//                 url: 'http://api.tvmaze.com/search/shows?q=' + search.val()
//             };
//             $.ajax(searchRequest).then(function(responseMessage) {
//                 event.preventDefault();
//                 list.empty();
//                 if (responseMessage.length == 0) {
//                     errortag.text("No results found").show();
//                 } else {
//                     for (let i = 0; i < responseMessage.length; i++) {
//                         list.append(`<li><a href="${responseMessage[i].show._links.self.href}">${responseMessage[i].show.name}</a></li>`);
//                     }
//                     errortag.hide();
//                 }
//             });
//             list.show();

//             backlink.show();
//         }
//     });


//     $(document).on("click", "#showList > li > a", function(event) {
//         event.preventDefault();
//         var href = $(this).attr('href')
//         list.hide();
//         shows.empty();
//         errortag.hide();
        

//     });

// })(window.jQuery);