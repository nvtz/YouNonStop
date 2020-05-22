var Modals = {
    codes: {
        K0: 'K'.charCodeAt(0),
        K1: 'k'.charCodeAt(0),
        A0: 'A'.charCodeAt(0),
        A1: 'a'.charCodeAt(0),
        C0: 'C'.charCodeAt(0),
        C1: 'c'.charCodeAt(0),
        X0: 'X'.charCodeAt(0),
        X1: 'x'.charCodeAt(0),
    },

    init: function (about, contact, shortcuts) {
        this.about = about;
        this.contact = contact;
        this.shortcuts = shortcuts;

        this.bindModalEvents();
    },

    bindModalEvents: function () {
        var that = this;

        $('body').on('keyup', function (e) {
            switch (e.keyCode) {
                case that.codes.K0:
                case that.codes.K1:
                    if (e.altKey) {
                        that.about.modal('hide');
                        that.contact.modal('hide');
                        that.shortcuts.modal('show');
                    }
                    break;

                case that.codes.A0:
                case that.codes.A1:
                    if (e.altKey) {
                        that.shortcuts.modal('hide');
                        that.contact.modal('hide');
                        that.about.modal('show');
                    }
                    break;

                case that.codes.C0:
                case that.codes.C1:
                    if (e.altKey) {
                        that.about.modal('hide');
                        that.shortcuts.modal('hide');
                        that.contact.modal('show');
                    }
                    break;

                case that.codes.X0:
                case that.codes.X1:
                    that.actOnAllModals('hide');
                    break;
            }
        });
    },

    actOnAllModals: function (action) {
        this.shortcuts.modal(action);
        this.about.modal(action);
        this.contact.modal(action);
    }
};

export default Modals;