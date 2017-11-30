/* bender-tags: editor,balloonpanel */
/* bender-ckeditor-plugins: balloonpanel,toolbar,wysiwygarea,basicstyles */
/* bender-include: ./_helpers/tools.js */
/* global balloonTestsTools */

( function() {
	'use strict';

	var stubs = [];

	bender.editors = {
		classic: {
			name: 'editor1',
			startupData: '<p><strong>Hello</strong> world</p>',
			config: {
				width: 300,
				height: 300,
				allowedContent: true
			}
		},
		divarea: {
			name: 'editor2',
			startupData: '<p><strong>Hello</strong> world</p>',
			config: {
				width: 300,
				height: 300,
				allowedContent: true,
				extraPlugins: 'divarea'
			}
		},
		inline: {
			name: 'editor3',
			startupData: '<p><strong>Hello</strong> world</p>',
			creator: 'inline',
			config: {
				width: 300,
				height: 300,
				allowedContent: true
			}
		}

	};

	function calculatePositions( editor, panelWidth, panelHeight ) {
		var panel = new CKEDITOR.ui.balloonPanel( editor, {
			title: 'Test panel #1',
			width: panelWidth,
			height: panelHeight
		} );
		var element = editor.editable().findOne( 'strong' );

		panel.attach( element );

		return {
			elementRect: balloonTestsTools.getAbsoluteRect( editor, element ),
			triangleTip: balloonTestsTools.getTriangleTipPosition( panel ),
			panel: panel
		};
	}

	var tests = {
		setUp: function() {
			var stub = sinon.stub( CKEDITOR.dom.window.prototype, 'getViewPaneSize' );
			stubs.push( stub );
			stub.returns( {
				width: 2000,
				height: 3000
			} );
		},
		tearDown: function() {
			var stub;
			while ( stub = stubs.pop() ) {
				stub.restore();
			}
		},
		'test positioning in nonstatic body': function( editor ) {
			CKEDITOR.document.getBody().setStyles( {
				position: 'relative',
				'margin-left': '300px',
				'margin-top': '300px',
				'min-width': '2000px',
				'min-height': '3000px'
			} );
			var BODY_MARGIN_LEFT = parseInt( CKEDITOR.document.getBody().getComputedStyle( 'margin-left' ), 10 ),
				BODY_MARGIN_TOP = parseInt( CKEDITOR.document.getBody().getComputedStyle( 'margin-top' ), 10 ),
				DELTA = 1,
				pos;

			pos = calculatePositions( editor, 100, 50 );

			// Because balloon is positioned absolutely, and body is relative with margin, then we need to add those margin to final result to get proper position on the screen.
			assert.isNumberInRange( pos.triangleTip.x + BODY_MARGIN_LEFT, pos.elementRect.left - DELTA, pos.elementRect.right + DELTA, 'Triangle tip x position outsid of element' );
			assert.isNumberInRange( pos.triangleTip.y + BODY_MARGIN_TOP, pos.elementRect.top - DELTA, pos.elementRect.bottom + DELTA, 'Triangle tip y position outsid of element' );
			pos.panel.destroy();
			CKEDITOR.document.getBody().removeStyle( 'min-width' );
			CKEDITOR.document.getBody().removeStyle( 'min-height' );
		},
		'test positioning in nonstatic body big panel': function( editor ) {
			CKEDITOR.document.getBody().setStyles( {
				position: 'relative',
				'margin-left': '600px',
				'margin-top': '600px'
			} );

			var BODY_MARGIN_LEFT = parseInt( CKEDITOR.document.getBody().getComputedStyle( 'margin-left' ), 10 ),
				BODY_MARGIN_TOP = parseInt( CKEDITOR.document.getBody().getComputedStyle( 'margin-top' ), 10 ),
				DELTA = 1,
				pos;

			pos = calculatePositions( editor, 400, 300 );

			// Because balloon is positioned absolutely, and body is relative with margin, then we need to add those margin to final result to get proper position on the screen.
			assert.isNumberInRange( pos.triangleTip.x + BODY_MARGIN_LEFT, pos.elementRect.left - DELTA, pos.elementRect.right + DELTA, 'Triangle tip x position outsid of element' );
			assert.isNumberInRange( pos.triangleTip.y + BODY_MARGIN_TOP, pos.elementRect.top - DELTA, pos.elementRect.bottom + DELTA, 'Triangle tip y position outsid of element' );
			pos.panel.destroy();
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
