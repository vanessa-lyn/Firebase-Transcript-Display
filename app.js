
// var myDataRef = new Firebase('https://n24xfa45b9f.firebaseio-demo.com/');

$(function ($) {

    var rootData = new Firebase('https://interview-bolster.firebaseio.com/');
    var topics = rootData.child('topics');
    var topicsDataObj;
    var participants = rootData.child('participants');
    var participantsDataObj;
    var transContent = $('<div/>');
    var search = $('#search input');
    var searchMessage = "Search Transcripts";
    var searchingNotes = false;



    participants.once("value", function (snapshot) {
        participantsDataObj = snapshot.val();
        console.log("participantsDataObj" + participantsDataObj)
    });

    topics.once("value", function(snapshot) {
        topicsDataObj = snapshot;  
        generateContent();
    });

    search.attr('value', searchMessage)
    .on('focus', function () {
            search.attr('value', '');
        })
    .on('blur', function () {
        if(search.attr('value') === '') {
            search.attr('value', searchMessage);
        }
    })
    .bind('keypress', function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            searchKeyword = search.val();
            //resultContainer.html('');
            console.log('searchKeyword' + searchKeyword);
            if((searchKeyword !== '')||(searchKeyword !== ' ')) {
                searchData(searchKeyword);
            }
        }
    })

    // function checkKeyword(keyword) {
    //     console.log('keyword' + keyword);

    //     // if((keyword !== '')||(keyword !== ' ')) {
    //     //     searchingNotes == true; 
    //     // }
    //     // console.log(topicsDataObj.contains(keyword));

    //     //One way of doing it but I want to find a possible better method
    //     //$( "p:contains('killer')" ).css( "text-decoration", "underline" );
    // }


    function findSpeakerAvater (speakerNum) {

       // console.log(participantsDataObj[speakerNum].avatar);
        return participantsDataObj[speakerNum].avatar;  

    }

    function searchData (keyword) {

        console.log('searching data');
        console.log('keyword ' + keyword);
        
        transContent = $('<div/>');

        topicsDataObj.forEach(function(data) {
            var title = data.val().name;
            console.log('for each' + title);
            if (title.indexOf(keyword) > -1){
                higlightedTxt = data.val().name.replace(keyword, '<span class="highlight">'+keyword+'</span>');

                transContent.append( $('<h2/>', {
                    'class': 'topic-header',
                    html: higlightedTxt
                }));
            }

            $("h2:contains('cow')").html(function(_, html) {
                   return html.replace(/(cow)/g, '<span class="smallcaps">$1</span>');
            });
            data.child('discussion').forEach( function(content) {
                var note = content.val().text;
                //console.log('content ' + content.val().text);

                var speakerAvatar = findSpeakerAvater(content.val().speaker);

                if(note.indexOf(keyword) > -1) {
                    higlightedTxt = content.val().text.replace(keyword, '<span class="highlight">'+keyword+'</span>');
                    transContent.append( $('<div/>', {
                        'class': 'note',
                        html: "<img class='avatar' src='" + speakerAvatar + "'/><p>" + higlightedTxt + "</p>"
                    }));
                } 
            });

        });

        $('#content').html(transContent);
    }

    function generateContent () {
        var topicsMenu = $('<ul/>', {
            'class': 'topics-menu'
        });

        topicsDataObj.forEach(function(data) {
            generateTopicMenu (topicsMenu, data)
            generateTopicContent(transContent, data)

        });

        $('#menu').append(topicsMenu);
        $('#content').append(transContent);
    }

    function generateTopicMenu (menu, data) {
        menu.append( $('<li>', {
            html: $('<a/>', {
                href: '#',
                text: data.val().name,
                'topic': data.key(),
                click: showSingleTopic
            }) 
        }));
    }

    //function for generating topic content
    function generateTopicContent(topic, data){

        console.log(data.val().name);
        topic.append( $('<h2/>', {
            'class': 'topic-header',
            text: data.val().name
        }));

        data.child('discussion').forEach( function(content) {
            var speakerAvatar = findSpeakerAvater(content.val().speaker);

            topic.append( $('<div/>', {
                'class': 'note',
                html: "<img class='avatar' src='" + speakerAvatar + "'/><p>" + content.val().text + "</p>"
            }));
        });
    }

    function showSingleTopic(evt) {
        var el = $(evt.target);
        var key = el.attr('topic')
        transContent = $('<div/>');
        var topicChild = topics.child(key);

        topicChild.once("value", function(snapshot){
            topicsDataObj = snapshot;
            generateTopicContent(transContent, topicsDataObj);
            $('#content').html(transContent);
        })
    }

});