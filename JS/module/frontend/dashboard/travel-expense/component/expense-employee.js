app.component('employeeStatus', {
    bindings: {
        data: '=',
        reconcile: '&'
    },
    controller: function () {
        this.currentStatus = {
            status: null,
            class: null,
            isReconcile: false
        };
        this.onreconcile = function (item) {
            this.reconcile(item);
        };
        var item = this.data;
        if (item.status != 9 && item.status != 11) {
            if (item.payment_method == 1) {
                if (item.payment_status == 1) {
                    this.currentStatus.status = "Advance Payment Pending";
                    this.currentStatus.class = "orange";
                } else if (item.is_reconciliation && item.payment_status == 2) {
                    if (item.is_reconcile_request && item.reconciliation_status == 2) {
                        this.currentStatus.status = "Reconciled and Closed";
                        this.currentStatus.class = "green";
                        this.currentStatus.isReconcile = false;
                    } else if (item.is_reconcile_request && item.reconciliation_status == 1) {
                        this.currentStatus.status = "Reconcile Request Raised - Settlement Pending";
                        this.currentStatus.class = "blue";
                        this.currentStatus.isReconcile = false;
                    } else if (!item.is_reconcile_request) {
                        //                        item.status = "Reconcialtion Settlement Pending";
                        this.currentStatus.class = "blue";
                        this.currentStatus.isReconcile = true;
                    }
                } else if (!item.is_reconciliation && item.payment_status == 2) {
                    this.currentStatus.status = "Advance Paid - Closed";
                    this.currentStatus.class = "green";
                }
            }
            if (item.payment_method == 2) {
                if (item.payment_status == 1) {
                    this.currentStatus.status = "Payment Pending";
                    this.currentStatus.class = "orange";
                } else if (item.payment_status == 2) {
                    this.currentStatus.status = "Paid - Closed";
                    this.currentStatus.class = "green";
                }
            }
            if (item.payment_method == 3) {
                if (item.booking_status == 1 || !item.booking_status) {
                    this.currentStatus.status = "Pending on Travel Planner";
                    this.currentStatus.class = "orange";
                } else if (item.booking_status == 2) {
                    this.currentStatus.status = "Booked by Travel Planner";
                    this.currentStatus.class = "green";
                } else {
                    this.currentStatus.status = "Rejected by Travel Planner";
                    this.currentStatus.class = "red";
                }
            }
        } else {
            if (item.group_request_status && item.group_request_status == 11) {
                this.currentStatus.status = "Rejected by Group Employee";
                this.currentStatus.class = "red";
            } else {
                this.currentStatus.status = "Rejected";
                this.currentStatus.class = "red";
            }
        }

    },
    template: [
        '<div ng-if="!$ctrl.currentStatus.isReconcile" ng-class="$ctrl.currentStatus.class">{{$ctrl.currentStatus.status}}</div>',
        '<div ng-if="$ctrl.currentStatus.isReconcile"><md-button class="blue-bg white"  ng-click="$ctrl.onreconcile(this.data)">Reconcile</md-button></div>'
    ].join('')
});
