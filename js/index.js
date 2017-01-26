$( document ).ready( function( ) {
      var config = {
            apiKey: "AIzaSyALn_c79BvSqEQAbNKGBNYYXVJCDEWER-Y",
            authDomain: "voting-d2df5.firebaseapp.com",
            databaseURL: "https://voting-d2df5.firebaseio.com",
            storageBucket: "voting-d2df5.appspot.com",
            messagingSenderId: "1032494254100"
      };
      firebase.initializeApp( config );

      var king_vote = firebase.database( ).ref( ).child( 'vote/king' );
      var queen_vote = firebase.database( ).ref( ).child( 'vote/queen' );
      var king_voted_list = firebase.database( ).ref( ).child( 'king' );
      var queen_voted_list = firebase.database( ).ref( ).child( 'queen' );

      $( '#Glide' ).hide( );
      $( "#Glide" ).glide( {
            type: "carousel",
            paddings: "25px"
      } );

      $( '.king' ).click( function( e ) {
            e.preventDefault( );
            king_vote.transaction( function( vote ) {
                  if ( vote != null ) {
                        vote++;
                        king_vote.set({ user_id : firebase.auth().currentUser });
                        $( '.king' ).prop( 'disabled', true );
                  }
                  return vote;
            } );
      } );

      $( '.queen' ).click( function( e ) {
            e.preventDefault( );
            queen_vote.transaction( function( vote ) {
                  // if ( vote != null ) {
                        vote++;
                        queen_vote.set({ user_id : firebase.auth().currentUser });
                        $( '.queen' ).prop( 'disabled', true );
                  // }
                  return vote;
            } );
      } );


      $( '.style' ).click( function( e ) {
            e.preventDefault( );
            style_vote.transaction( function( vote ) {
                  if ( vote != null ) {
                        vote++;
                        var obj = {};
                        obj[ 'style_voted_list/' + firebase.auth( ).currentUser ] = 1;
                        style_voted_list.update( obj );
                        $( '.style' ).prop( 'disabled', true );
                  }
                  return vote;
            } );
      } );


      $( '#facebook_login' ).click( function( e ) {

            e.preventDefault( );
            var provider = new firebase.auth.FacebookAuthProvider( );
            firebase.auth( ).signInWithPopup( provider )
                  .then( function( result ) {

                        $( '#facebook_login' ).hide( );
                        $( '#Glide' ).show( );
                        console.log( result.user.uid );
                        current_user_id = result.user.id;

                        king_voted_list.orderByChild( 'user_id' )
                              .equalTo( user.id )
                              .once( 'value' )
                              .then( function( snapshot ) {
                                    var value = snapshot.val( );
                                    if ( value ) {
                                          $( '.king' ).prop( 'disabled', true );
                                    }
                              } );

                        queen_voted_list.orderByChild( 'user_id' )
                              .equalTo( user.id )
                              .once( 'value' )
                              .then( function( snapshot ) {
                                    var value = snapshot.val( );
                                    if ( value ) {
                                          $( '.queen' ).prop( 'disabled', true );
                                    }
                              } );

                  } )
                  .catch( function( error ) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var email = error.email;
                        var credential = error.credential;
                        console.log( errorMessage );

                  } );


      } );

      firebase.auth( ).onAuthStateChanged( function( user ) {
            if ( user ) {
                  console.log( user );
                  $( '#facebook_login' ).hide( );
                  $( '#Glide' ).show( );
                  // king_voted_list.child( result.user.uid ).once( 'value', function( snapshot ) {
                  //       if ( snapshot.val( ) !== null ) {
                  //             $( '.king' ).prop( 'disabled', true );
                  //       }
                  //       console.log( snapshot.val( ) );

                  // } );

                  king_voted_list.orderByChild( 'user_id' )
                        .equalTo( user.id )
                        .once( 'value' )
                        .then( function( snapshot ) {
                              var value = snapshot.val( );
                              if ( value ) {
                                    $( '.king' ).prop( 'disabled', true );
                              }
                        } );

                  queen_voted_list.orderByChild( 'user_id' )
                        .equalTo( user.id )
                        .once( 'value' )
                        .then( function( snapshot ) {
                              var value = snapshot.val( );
                              if ( value ) {
                                    $( '.queen' ).prop( 'disabled', true );
                              }
                        } );


            } else {
                  console.log( "No User!" )
            }

      } );

} );
