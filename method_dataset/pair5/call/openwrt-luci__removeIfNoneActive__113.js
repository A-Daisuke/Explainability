			var removeIfNoneActive = function(original_remove_fn, section_id) {
				var isAnyActive = false;

				for (var optname in opts) {
					if (opts[optname].ucioption != this.ucioption)
						continue;

					if (!opts[optname].isActive(section_id))
						continue;

					isAnyActive = true;
					break;
				}

				if (!isAnyActive)
					original_remove_fn.call(this, section_id);
			};
