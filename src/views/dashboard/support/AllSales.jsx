import React from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components'
import {Tabs} from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import SaleActivations from './SaleActivations.jsx'
import SaleCustomers from './SaleCustomers.jsx'

const AllSales = () => {
    return (
        <>
            <div>
                <AppSidebar />
                <div className="wrapper d-flex flex-column min-vh-100">
                    <AppHeader />
                    <div className="body flex-grow-1 p-2">
                        <Tabs defaultActiveKey="1" style={{ marginTop: "-30px" }}>
                            <Tabs.Tab eventKey="1" title="Sale Customer">
                                <SaleCustomers />
                            </Tabs.Tab>
                            <Tabs.Tab eventKey="2" title="Sale Activation">
                                <SaleActivations />
                            </Tabs.Tab>
                        </Tabs>

                    </div>
                    <AppFooter />
                </div>
            </div>
        </>
    )
}

export default AllSales
