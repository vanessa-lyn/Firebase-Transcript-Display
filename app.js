
// var myDataRef = new Firebase('https://n24xfa45b9f.firebaseio-demo.com/');

$(function ($) {

    var rootData = new Firebase('https://interview-bolster.firebaseio.com/');
    var topics = rootData.child('topics');
    var topicsDataObj;
    var participants = rootData.child('participants');
    var participantsDataObj;
    var transContent = $('<div/>');



    participants.once("value", function (snapshot) {
        participantsDataObj = snapshot.val();
        console.log("participantsDataObj" + participantsDataObj)
    });

    topics.once("value", function(snapshot) {
        topicsDataObj = snapshot;  
        generateContent();
    });


    function findSpeakerAvater (speakerNum) {

       // console.log(participantsDataObj[speakerNum].avatar);
        return participantsDataObj[speakerNum].avatar;  

    }

    function searchData () {
        //how do I query this to pull only discussion topics that have whatever's being searched for?

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

        var menuItem = $('.topics-menu li');
        menuItem.on('click', showSingleTopic);
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

    function generateTopicMenu (menu, data) {
        menu.append( $('<li>', {
            html: $('<a/>', {
                href: '#',
                text: data.val().name,
                'topic': data.key()
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

});