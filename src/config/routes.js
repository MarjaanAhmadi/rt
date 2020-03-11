import React from 'react'
import Users from "../pages/users/users";
import Invoices from "../pages/invoices/invoices";
import BaseBalanceInvoice from "../pages/base-balance/baseBalanceInvoice";
import Trunks from "../pages/trunks/trunks";
import Phones from "../pages/phones/phones";
import Cdrs from "../pages/cdrs/cdrs";
import Extensions from "../pages/extensions/extensions";
import Credit from "../pages/credit/credit";
import Profits from "../pages/profits/profits";
import Branches from "../pages/branches/branches";
import BranchItem from "../pages/branches/branchItem/branchItem";
import PaymentItem from "../pages/credit/paymentItem/paymentItem";
import InvoiceItem from "../pages/invoices/invoiceItem/invoiceItem";
import OperatorItem from "../pages/operators/operatorItem/operatorItem";
import BaseBalanceInvoiceItem from "../pages/base-balance/baseBalanceInvoiceItem/baseBalanceInvoiceItem";
import Operators from "../pages/operators/operators";
import ProfitItem from "../pages/profits/profitItem/profitItem";
const routes = [
    {
        path: '/users-management',
        exact: true,
        name: 'UsersManagement',
        component: Users,
        icon: 'user',
        meta: {
            child: false
        }
    },
    {
        path: '/invoices',
        exact: true,
        name: 'Invoices',
        component: Invoices,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/invoice/:id',
        exact: true,
        name: 'Invoice',
        component: InvoiceItem,
        icon: 'file',
        meta: {
            child: true
        }
    },
    {
        path: '/base-balance-invoices',
        exact: true,
        name: 'baseBalanceInvoices',
        component: BaseBalanceInvoice,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/base-balance-invoice/:id',
        exact: true,
        name: 'baseBalanceInvoicesItem',
        component: BaseBalanceInvoiceItem,
        icon: 'file',
        meta: {
            child: true
        }
    },
    {
        path: '/payments',
        exact: true,
        name: 'payments',
        component: Credit,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/payment/:id',
        exact: true,
        name: 'payment item',
        component: PaymentItem,
        icon: 'file',
        meta: {
            child: true
        }
    },
    {
        path: '/trunk-numbers',
        exact: true,
        name: 'Trunk Numbers',
        component: Trunks,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/phones',
        exact: true,
        name: 'Phones',
        component: Phones,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/cdrs',
        exact: true,
        name: 'CDRs',
        component: Cdrs,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/extensions',
        exact: true,
        name: 'Extensions',
        component: Extensions,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/operators',
        exact: true,
        name: 'Operators',
        component: Operators,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/operator/:id',
        exact: true,
        name: 'Operator Item',
        component: OperatorItem,
        icon: 'file',
        meta: {
            child: true

        }
    },
    {
        path: '/profits',
        exact: true,
        name: 'Profits',
        component: Profits,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/profit/:id',
        exact: true,
        name: 'Profit Item',
        component: ProfitItem,
        icon: 'file',
        meta: {
            child: true

        }
    },
    {
        path: '/branches',
        exact: true,
        name: 'Branches',
        component: Branches,
        icon: 'file',
        meta: {
            child: false
        }
    },
    {
        path: '/branch/:id',
        exact: true,
        name: 'Branch Item',
        component: BranchItem,
        icon: 'file',
        meta: {
            child: true
        }
    },
    // {
    //     path: '/extensions',
    //     exact: true,
    //     name: 'Extensions',
    //     component: Extensions,
    //     icon: 'file',
    //     meta: {
    //         child: false
    //     }
    // }

];
export default routes;
