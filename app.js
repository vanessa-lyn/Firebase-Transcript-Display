
// var myDataRef = new Firebase('https://n24xfa45b9f.firebaseio-demo.com/');

$(function ($) {

    var rootData = new Firebase('https://interview-bolster.firebaseio.com/');
    //var rootData = new Firebase('https://interview-bolster.firebaseio.com/');
    var topics = rootData.child('topics');
    // var topicsObj = rootData.child('topics').exportVal();
    
    var topicsDataObj;

    var participants = rootData.child('participants');
    var participantsDataObj;
    
    console.log(participants)


    participants.once("value", function (snapshot) {
        participantsDataObj = snapshot.val();
        console.log("participantsDataObj" + participantsDataObj)
    });

    topics.once("value", function(snapshot) {
        //console.log(snapshot);

        topicsDataObj = snapshot;
        console.log('topicsDataObj'+topicsDataObj);
        //console.log('topicsDataObj first entry' + topicsDataObj[1].name);

        generateContent();

    });

    function findSpeakerAvater (speakerNum) {

        console.log(participantsDataObj[speakerNum].avatar);
        return participantsDataObj[speakerNum].avatar;  

    }

    function searchData () {
        //how do I query this to pull only discussion topics that have whatever's being searched for?

    }

    function generateContent () {
        var topicsMenu = $('<ul/>', {
            'class': 'topics-menu'
        });
        var transContent = $('<div/>');

        topicsDataObj.forEach(function(data) {
            console.log("The topic of" + data.val().name);
            console.log(data.child('discussion').numChildren());

            topicsMenu.append( $('<li>', {
                html: $('<a/>', {
                    href: '#',
                    text: data.val().name
                }) 
            }));

            transContent.append( $('<h2/>', {
                'class': 'topic-header',
                text: data.val().name
            }));

            data.child('discussion').forEach( function(content) {
                console.log('discussion content is ' + content.val().text)
                var speakerAvatar = findSpeakerAvater(content.val().speaker);

                transContent.append( $('<div/>', {
                    'class': 'note',
                    html: "<img class='avatar' src='" + speakerAvatar + "'/><p>" + content.val().text + "</p>"
                }));
            });

        });

        $('#menu').append(topicsMenu);
        $('#content').append(transContent);
    }

});