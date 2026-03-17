class __C__ {
		displayStatus(type, content) {
			if (type) {
				const message = UI.prototype.showModal('', '');

				message.classList.add('alert-message');
				DOMTokenList.prototype.add.apply(message.classList, type.split(/\s+/));

				if (content)
					dom.content(message, content);

				if (!this.was_polling) {
					this.was_polling = request.poll.active();
					request.poll.stop();
				}
			}
			else {
				UI.prototype.hideModal();

				if (this.was_polling)
					request.poll.start();
			}
		},

}
