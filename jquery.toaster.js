/***********************************************************************************
* Add Array.indexOf                                                                *
***********************************************************************************/
(function ()
{
	if (typeof Array.prototype.indexOf !== 'function')
	{
		Array.prototype.indexOf = function(searchElement, fromIndex)
		{
			for (var i = (fromIndex || 0), j = this.length; i < j; i += 1)
			{
				if ((searchElement === undefined) || (searchElement === null))
				{
					if (this[i] === searchElement)
					{
						return i;
					}
				}
				else if (this[i] === searchElement)
				{
					return i;
				}
			}
			return -1;
		};
	}
})();
/**********************************************************************************/

(function ($,undefined)
{
	var toasting =
	{
		gettoaster : function ()
		{
			var toaster = $('#' + settings.toaster.id);

			if(toaster.length < 1)
			{
				toaster = $(settings.toaster.template).attr('id', settings.toaster.id).css(settings.toaster.css).addClass(settings.toaster['class']);

				if ((settings.stylesheet) && (!$("link[href=" + settings.stylesheet + "]").length))
				{
					$('head').appendTo('<link rel="stylesheet" href="' + settings.stylesheet + '">');
				}

				$(settings.toaster.container).append(toaster);
			}

			return toaster;
		},

		notify : function (title, message, priority)
		{
			var $toaster  = this.gettoaster();
			var $toast    = $(settings.toast.template.replace('%priority%', priority)).css(settings.toast.css).addClass(settings.toast['class']);

			$('.title', $toast).css(settings.toast.csst).html(title);
			$('.message', $toast).css(settings.toast.cssm).html(message);

			if ((settings.debug) && (window.console))
			{
				console.log(toast);
			}

			$toast.on('hidden.bs.toast', function(){
				$toast.remove();
			});
			var timeout;
			if (settings.donotdismiss.indexOf(priority) === -1){
				timeout = (typeof settings.timeout === 'number') ? settings.timeout : ((typeof settings.timeout === 'object') && (priority in settings.timeout)) ? settings.timeout[priority] : 3000;
			} else {
				timeout = 0;
			}
			$toaster.append(settings.toast.display($toast, timeout));
		}
	};

	var defaults =
	{
		'toaster'         :
		{
			'id'        : 'toaster',
			'container' : 'body',
			'template'  : '<div></div>',
			'class'     : 'toaster',
			'css'       :
			{
				'position' : 'fixed',
				'top'      : '10px',
				'right'    : '10px',
				'width'    : '300px',
				'zIndex'   : 50000
			}
		},

		'toast'       :
		{
			'template' :
			'<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-animation="true" data-autohide="false">' +
				'<div class="toast-header"> ' +
					'<strong class="mr-auto text-%priority% title"></strong>' +
					'<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">' +
						'<span aria-hidden="true">&times;</span>' +
					'</button>' +
				'</div>' +
				'<div class="toast-body">' +
					'<span class="message"></span>' +
				'</div>' +
			'</div>',

			'defaults' :
			{
				'title'     : '提示',
				'priority'  : 'success',
			},

			'css'      : {},
			'cssm'     : {},
			'csst'     : { 'fontWeight' : 'bold' },

			'fade'     : 'slow',

			'display'    : function ($toast, timeout)
			{
				if(timeout > 0){
					$toast.toast({
						autohide: true,
						delay: timeout,
					});
				}
				$toast.css('opacity', 0);
				let ret = $toast.toast('show');
				setTimeout(function(){
					$toast.css('opacity', 1);
				});
				setTimeout(function(){
					$toast.css('opacity', '');
				}, 200);
				return ret;
			},

			'remove'     : function ($toast, callback)
			{
				setTimeout(function(){
					callback();
				}, 1000);
				return $toast.toast('hide');
			}
		},

		'debug'        : false,
		'timeout'      : 5000,
		'stylesheet'   : null,
		'donotdismiss' : []
	};

	var settings = {};
	$.extend(settings, defaults);

	$.toaster = function (options)
	{
		if (typeof options === 'object')
		{
			if ('settings' in options)
			{
				settings = $.extend(true, settings, options.settings);
			}
		}
		else
		{
			var values = Array.prototype.slice.call(arguments, 0);
			var labels = ['message', 'title', 'priority'];
			options = {};

			for (var i = 0, l = values.length; i < l; i += 1)
			{
				options[labels[i]] = values[i];
			}
		}

		var title    = (('title' in options) && (typeof options.title === 'string')) ? options.title : settings.toast.defaults.title;
		var message  = ('message' in options) ? options.message : null;
		var priority = (('priority' in options) && (typeof options.priority === 'string')) ? options.priority : settings.toast.defaults.priority;

		if (message !== null)
		{
			toasting.notify(title, message, priority);
		}
	};

	$.toaster.reset = function ()
	{
		settings = {};
		$.extend(settings, defaults);
	};
})(jQuery);
