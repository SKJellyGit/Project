app.constant("VALIDATION_ERROR", {
    "IN": {
        login: {
            email: {
                required: "Please enter your email address",
                format: "Please enter a valid email address",
                maxlength: "Please enter maximum 40 characters"
            },
            password: {
                required: "Please enter your password",
                minlength: "Please enter minimum 8 characters",
                maxlength: "Please enter maximum 35 characters"
            },
            emp_code: {
                required: "Please enter your employee code",
                maxlength: "Please enter maximum 40 characters"
            },
            otp: {
                required: "Please enter otp"
            }
        },
        register: {
            email: {
                required: "Please enter your email address",
                format: "Please enter a valid email address",
                maxlength: "Please enter maximum 40 characters"
            },
            company: {
                required: "Please enter your company name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            }
        },
        token: {
            email: {
                required: "Please enter your email address",
                format: "Please enter a valid email address",
                maxlength: "Please enter maximum 40 characters"
            }
        },
        profile: {
            fullname: {
                required: "Please enter your fullname",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            email: {
                required: "Please enter your email address",
                format: "Please enter a valid email address",
                maxlength: "Please enter maximum 40 characters"
            },
            password: {
                required: "Please enter your password",
                minlength: "Please enter minimum 8 characters",
                maxlength: "Please enter maximum 35 characters",
                pattern: "Entered password doesn't match the specified format"
            },
            cpassword: {
                required: "Please enter your password",
                minlength: "Please enter minimum 8 characters",
                maxlength: "Please enter maximum 35 characters",
                pattern: "Entered password doesn't match the specified format"
            },
            contact: {
                required: "Please enter your contact number",
                minlength: "Please enter minimum 8 characters",
                maxlength: "Please enter maximum 15 characters"
            }
        },
        superAdmin: {
            name: {
                required: "Please enter your name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            email: {
                required: "Please enter your email address",
                format: "Please enter a valid email address",
                maxlength: "Please enter maximum 40 characters"
            }
        },
        hierarchy: {
            hierarchy: {
                required: "Please enter hierarchy"
            },
            band: {
                required: "Please enter grade/band/level"
            },
            designation: {
                required: "Please enter designation"
            },
        },
        department: {
            name: {
                required: "Please enter department name"
            },
            band: {
                required: "Please enter grade/band/level"
            },
            designation: {
                required: "Please enter designation"
            },
        },
        company: {
            company_name: {
                required: "Please enter your company name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 100 characters"
            },
            subdomain: {
                required: "Please enter your fullname name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            legal_entity_name: {
                required: "Please enter your legal entity name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            type_of_business: {
                required: "Please enter your type of buisness"
            },
            cin: {
                required: "Please enter your cin",
                pattern: "Please enter valid cin number"
            },
            tan: {
                required: "Please enter your tan",
                pattern: "Please enter valid tan number"
            },
            pan: {
                required: "Please enter your pan",
                pattern: "Please enter valid pan number"
            },
            addr1: {
                required: "Please enter your address1"
            },
            zip: {
                required: "Please enter zicode/pincode",
                minlength: "Please enter minimum 6 characters"
            },
            city: {
                required: "Please enter city"
            },
            state: {
                required: "Please enter state"
            },
            country: {
                required: "Please enter country"
            }
        },
        location: {
            location_name: {
                required: "Please enter your Location name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            address_1: {
                required: "Please enter your Address",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            city: {
                required: "Please enter your city",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            state: {
                required: "Please enter your state",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            pin_code: {
                required: "Please enter your zip/pin name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            country: {
                required: "Please enter country",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            }
        },
        signatory: {
            signatory_name: {
                required: "Please enter your name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            signatory_email: {
                required: "Please enter your email address",
                format: "Please enter a valid email address",
                maxlength: "Please enter maximum 40 characters"
            },
            signatory_fathers_name: {
                required: "Please enter your father's name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            signatory_designation: {
                required: "Please enter your designation",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            signatory_pan: {
                required: "Please enter your pan",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            signatory_addr1: {
                required: "Please enter your Address",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            signatory_addr2: {
                required: "Please enter your Address name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            pin_code: {
                required: "Please enter your zip/pin name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            city: {
                required: "Please enter your city",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            state: {
                required: "Please enter your state",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            country: {
                required: "Please enter country",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            }
        },
        holiday: {
            holiday_name: {
                required: "Please enter your holiday name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 100 characters"
            },
            date: {
                required: "Please select a date"
            },
            has_rh: {
                required: "Please select a date"
            },
            max_limit: {
                required: "Please select a date"
            }
        },
        holidayConfig: {
            has_rh: {
                required: "Please select a date"
            },
            max_limit: {
                required: "Please select a date"
            }
        },
        companyBasicInfo:{
             legalIntName: {
                required: "Please enter Legal Entity Name"
            },
             typeOfBus: {
                required: "Please enter Type of Business"
            },
             cin: {
                required: "Please enter Corporate Identity Number",
                pattern: "Please enter valid CIN no. Ex:L61234LA4321ABC654321",
                minlength: "Please enter minimum 21 characters"
            },
            cr: {
                required: "Please enter CR Number",
                pattern: "Please enter valid CR no. Ex:L61234LA4321ABC654321",
                minlength: "Please enter minimum 21 characters"
            },
        },
        bankAccount: {
            name: {
                required: "Please enter account name"
            },
            acnt_no: {
                required: "Please enter account no.",
                minlength: "Account no. is not valid",
                maxlength: "Account no. is not valid"
            },
            ifsc: {
                required: "Please enter IFSC Code",
                minlength: "IFSC code is not valid it is 11 digits code"
            },
            branch: {
                required: "Please enter bank branch"
            },
            braAddress: {
                required: "Please enter bank branch address"
            }
        },
        tax: {
            pan: {
                required: "Please enter pan No",
                pattern: "Please enter valid pan no. Ex:ABCDE1234L"
            },
            tan: {
                 required: "Please enter tan no.",
                 pattern: "Please enter valid pan no. Ex:ANBA99999B"
            },
            area_code: {
                required: "Please enter area code"
            },
            tin: {
                required: "Please enter TIN no."
            },
            ao_type: {
                required: "Please enter AO Type"
            },
            ao_number: {
                required: "Please enter AO Number"
            },
            range_code: {
                required: "Please enter range code"
            },
            form_16_signatory: {
                required: "Please enter form 16 signatory"
            }
        },
        payrollCycle: {
            employee_type: {
                required: "Please select aplicability"
            },
            contractor_type: {
                required: "Please enter contractor type"
            },
            consultant_type: {
                required: "Please enter consultant type"
            },
            pay_frequency: {
                required: "Please select payment frequency"
            },
            date: {
                required: "Please enter payment day"
            },
            run_day: {
                required: "Please enter payroll run day"
            },
            run_date: {
                required: "Please enter payroll run date"
            },
            processing_day: {
                required: "Please enter processing days"
            },
            for_work_done: {
                required: "Please select for work done"
            }
        },
        pfInfo: {
            pf_no: {
                required: "Please enter PF Number"
            },
            registration_date: {
                required: "Please enter registration date"
            },
            signatory: {
                required: "Please select signatory"
            },
            pf_code: {
                required: "Please enter PF code",
                pattern: "Please enter valid PF code."
            },
            optOutsal: {
                required: "Please enter Employee Salary"
            }
        },
        incomeTax: {
            days:{
                required: "Please enter the days"
            },
            date:{
                required: "Please select date"
            },
            month:{
                required: "Please select month"
            },
            address:{
                required: "Please enter address"
            },
            fatherName:{
                required: "Please enter father's name"
            },
            designation:{
                required: "Please enter designation"
            }
        },
        compensationPlan: {
            planName:{
                required: "Please enter the plan name"
            },
            planDescription:{
                required: "Please enter the plan description"
            },
            planPrview: {
                required: "Please enter CTC"
            }
        },
        EDLI: {
            edliCharges: {
                required: "Please enter EDLI charges"
            },
            adminCharges: {
                required: "Please enter EDLI admin charges"
            }
        },
        flexiPay: {
            mandatoryComponent: {
                required: "Please enter minimum number of mandatory components"
            },
            adminCharges: {
                required: "Please enter EDLI admin charges"
            }
        },
        candidateoffer: {
            first_name :   {
                required: "Please enter the first name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            last_name :   {
                required: "Please enter the last name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            email : {
                required: "Please enter email",
                format: "Please enter a valid email address"
            },
            prejoin_set_id : {
                required: "Please enter pre-join set"
            },
            level : {
                required: "Please select level"
            },
            location : {
                required: "Please select location"
            },
            department : {
                required: "Please select department"
            },
            notice_period_value: {
                required: "Please enter notice period"
            },
            notice_period_unit :   {
                required: "Please enter unit"
            },
            probation_period_value :   {
                required: "Please enter probation period"
            },
            probation_period_unit :   {
                required: "Please enter unit"
            }
        },
        adhoc: {
            name: {
                required: "Please enter component name"
            },
            description: {
                required: "Please enter description"
            }
        },
        leaveType: {
            name: {
                required: "Please enter leave type"
            },
            description: {
                required: "Please enter leave description"
            },
            request_leave_days: {
                required: "Please enter request leave of days"
            },
            approval_leave_days: {
                required: "Please enter request leave of days"
            }
        },
        allowance: {
            name: {
                required: "Please enter allowance name"
            },
            annual_limit: {
                required: "Please enter maximum annual limit"
            },
            description: {
                required: "Please enter description"
            },
            restriction: {
                required: "Please enter restriction text"
            }
        },
        portal: {
            name :   {
                required: "Please enter your name"
            },
            email: {
                required: "Please enter your email address",
                format: "Please enter a valid email address"
            },
            contact_no :  {    
                required: "Please enter your contact number"
            },
            father_name :   {
                required: "Please enter your father's name "
            },
            mother_name :   {
                required: "Please enter your mother's name "
            },                        
            work_expirence:{
               required: "Please enter your experience details"
            },
            education:{
               required: "Please enter your education details"
            }
        },
        probationNotice: {
            name: {
                required: "Enter set name"
            },
            probation_period: {
                required: "Enter probation period"
            },
            notice_period_org_after: {
                required: "Enter notice period"
            },
            notice_period_org: {
                required: "Enter notice period"
            },
            notice_period: {
                required: "Enter probation period"
            },
            notice_period_after: {
                required: "Enter notice period"
            },
            allow_probation_min_limit: {
                required: "Enter minimum probation"
            },
            allow_probation_max_limit: {
                required: "Enter maximum probation"
            },
            allow_notice_min_limit: {
                required: "Enter minimum notice"
            },
            allow_notice_max_limit: {
                required: "Enter maximum notice"
            }
        },
        tasks: {
            name: {
                required: "Please enter task name"
            }
        },
        communication: {
            subject: {
                required: "Please enter subject"
            },
            message: {
                required: "Please enter message"
            }
        },
        overTimePolicy:{
            policy_name :   {
                required: "Please enter the first name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            }
        },
        attendanceException:{
            fullname :   {
                required: "Please enter exception name "
            },
            description:{
              required: "Please enter description "
            }
        },
        timeReporting:{
            name:{
                required:"Please enter setup name"
            }
        },
        timePlan:{
            plan_name :   {
                required: "Please enter the first name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            working_hours :   {
                required: "Please enter the working hours name",
            },
            locations :   {
                required: "Please enter the locations",
            },
        },
        timeShifts:{
            name :   {
                required: "Please enter the first name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            locations :   {
                required: "Please enter the locations",
            },
            duration_hours1 :   {
                required: "Please duration from",
            },
            duration_hours2 :   {
                required: "Please duration from",
            }
        },
        shifts:{
            name :   {
                required: "Please enter the first name",
                minlength: "Please enter minimum 5 characters",
                maxlength: "Please enter maximum 40 characters"
            },
            locations :   {
                required: "Please enter the locations",
            }
        },
        overtime:{
           employee_notify_type :   {
                required: "Please select employee notify type",
            },
            manger_notify_type :   {
                required: "Please select manager notify type",
            },
        },
        latepolicy:{
            threshold_minutes :   {
                required: "Please enter shift start time limit",
            },
            treatment_type :   {
                required: "Please select treatment type",
            },
            employee_notify_type :   {
                required: "Please select employee notify type",
            },
            manger_notify_type :   {
                required: "Please select manager notify type",
                }
            },
        slab: {
            order: {
                required: "Please enter slab order"
            },
            start_range: {
                required: "Please enter salary start range"
            },
            end_range: {
                required: "Please enter salary end range"
            }
        },
        approvalLevel: {
            days_to_approve: {
                required: "Please enter days to approve"
            }
        },
        reimbursement: {
            bill: {
                required: "Please enter bill number"
            },
            date: {
                required: "Please provide date"
            },
            amount: {
                required: "Please enter amount"
            }
        },
        exit:{
            empInfo:{
                email:{
                    required: "Please enter your email address",
                    format: "Please enter a valid email address",
                    maxlength: "Please enter maximum 40 characters"                    
                },
                notice:{
                    required: "Please enter the notic period",
                    maxlength:"Please provide valid notice period"
                },
                buyOutAmt:{
                    required: "Please enter the amount",
                    maxlength:"Please provide valid amount"
                },
                serv_amt:{
                    required: "Please enter the amount"
                },
                serv_mnth:{
                    required: "Please enter the month"
                },
                remark:{
                    required: "Please enter the remark"
                }
            },
            clearances:{
                required: "Please enter the clearance name"
            }
        },
        group: {
            name: {
                required: "Please enter group name"
            },
            format_type: {
                required: "Please enter format"
            },
            segment: {
                required: "Please enter profile segment"
            }
        },
        element: {
            name: {
                required: "Please enter element name"
            }
        },
        systemInfo: {
            mailServer: {
                required: "Please enter mail server"
            },
            fromName: {
                required: "Please enter from name"
            },
            username: {
                required: "Please enter user name"
            },
            email: {
                required: "Please enter email",
                format: "Please enter a valid email address"
            },
            password: {
                required: "Please enter password"
            },
            encryptionType: {
                required: "Please enter connection type"
            },
            port: {
                required: "Please enter port number"
            }
        },
        filtersetting: {
            type: {
                required: "Please Select filter type"
            },
            values: {
                required: "Please Select filter value"
            }
        },
        calenderDetails: {
            name: {
                required: "Please enter name"
            },
            total_holiday: {
                required: "Please enter total day"
            },
            emp_avail_restrict: {
                required: "This is required"
            },
            total_restricted_holiday: {
                required: "This is required"
            }
        },
        holidayDetails: {
            name: {
                required: "Please enter name"
            },
            date: {
                required: "Please enter date"
            }
        },
        setting: {
            name: {
                required: "Please enter name"
            },
            existing: {
                required: "Please select a setting"
            }
        },
        provision: {
            categoryName: {
                required: "Please enter category name"
            },
            description: {
                required: "Please enter provision description"
            },
            provisionName: {
                required: "Please enter provision name"
            },
            existing: {
                required: "Please select a setting"
            }
        },
        requestflow: {
            name: {
                required: "Please enter name"
            }
        },
        formBuilder: {
            name: {
                required: "Please enter form name"
            },
            description: {
                required: "Please enter form description"
            }
        },
        candidatePortal: {
            documents_to_upload: {
                required: "Please select document"
            },
            profile_update_fields: {
                required: "Please select profile"
            }
        },
        formQuestion: {
            title: {
                required: "Please enter question text"
            },
            option: {
                required: "Please enter question text"
            }
        },
        useridentification: {
            user_number_limit: {
                required: "Please select user limit"
            },
            prefix_txt: {
                required: "Please enter custom prefix"
            },
            suffix_txt: {
                required: "Please enter custom suffix"
            },
            prefix_type : {
                required: "Please select prefix type"
            },
            suffix_type : {
                required: "Please select suffix type"
            },
            unique_type : {
                required: "Please select unique type"
            }
        },
        document: {
            name: {
                required: "Please enter name"
            },
            description: {
                required: "Please enter description"
            },
            approver_workflow: {
                required: "Please select approver workflow"
            },
            max_size: {
                required: "Please select maximum size"
            }
        },
        userdocsettinglist: {
            request_workflow: {
                required: "Please select request workflow"
            },
            change_workflow: {
                required: "Please select change workflow"
            },
            max_size: {
                required: "Please select maximum size"
            }
        },
        segmentDetails: {
            name: {
                required: "Please enter segment name"
            }
        },
        segmentFields: {
            name: {
                required: "Please enter field name"
            }
        },
        userManagementForm: {
            name: {
                required: "Please enter form name"
            },
            description: {
                required: "Please enter description"
            },
            link: {
                required: "Please enter link",
                pattern: "Please enter valid format"
            }
        },
        formException: {
            type: {
                required: "This is required"
            },
            value: {
                required: "This is required"
            }
        },
        profileField: {
            effectiveDate: {
                required: "Please enter effective date"
            },
            reasonSet: {
                required: "Please enter reason set"   
            },
            workflow: {
                required: "Please select workflow"
            },
            form: {
                required: "Please select form"      
            }            
        },
        requestLeave: {
            type: {
                required: "Please select leave type"
            },
            fromDate: {
                required: "Please select from date"   
            },
            toDate: {
                required: "Please select to date"
            },
            fromType: {
                required: "Please select from duration"      
            },
            toType: {
                required: "Please select to duration"      
            },
            comment: {
                required: "Please enter comment"      
            },
            notifyTo: {
                required: "Please select notify to"      
            },
            fromHours: {
                required: "Please select from hours"      
            },
            toHours: {
                required: "Please select to hours"      
            }
        },
        cycleInfo : {
            plan_name : {
                required: "Please enter plan name"
            },
            accounting_year_day_from : {
                required: "Please select date"
            },
            accounting_year_from : {
                required : "Please select month"
            },
            payment_frequency :  {
                required : "Please select frequency"
            },
            paymentCycle : {
                required: "Please select payment cycle"
            },
            paymentCycleType : {
                required: "Please select payment cycle option"
            },
            attenCycleType : {
                required: "Please select option"
            },
            payment_day : {
                required: "Please select payment day"
            },
            base_days : {
                required: "Please enter base day"
            },
            base_day_type : {
                required: "Please select base day type",
            },
            required_processing_time: {
                required : "please enter the processing day"
            },
            claim_day_from: {
                required: "Please select from day"
            },
            claim_day_to: {
                required: "Please select to day"
            }
        },
        contactDetails: {
            name: {
                required: "Please enter name"
            },
            email: {
                required: "Please enter email"
            },
            mobile_number: {
                required: "Please enter mobile number"
            }
        },
        insuranceType: {
            insurance_name: {
                required: "Please enter Insurance Name"
            }
        },
        budgetBreakdown: {
            hours: {
                required: "Please enter hours"
            },
            currency: {
                required: "Please enter currency"
            },
            amount: {
                required: "Please enter amount"
            }
        },
        jobAllocation: {
            client: {
                required: "Please enter client"
            },
            jobGroup: {
                required: "Please enter job group"
            },
            startDate: {
                required: "Please enter start date"
            },
            endDate: {
                required: "Please enter end date"
            },
            projectManagers: {
                required: "Please select project manager"
            },
            followers: {
                required: "Please select follower"
            },
            description: {
                required: "Please enter description"
            }
        },
        role: {
            name: {
                required: "Please enter role name"
            }
        },
        kra: {
            text: {
                required: "This is required"
            }
        },
        saveReport: {
            name: {
                required: "Report name is required"
            },
            description: {
                required: "Report description is required"
            }
        },
    }
});
