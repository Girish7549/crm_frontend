import React, { useEffect, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { AppFooter, AppHeader, AppSidebar } from '../../../components'
import { Tabs } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'


const ThemeView = () => {
    const [color, setColor] = useState('rgb(255, 255, 255)')
    const ref = createRef()

    useEffect(() => {
        const el = ref.current.parentNode.firstChild
        const varColor = window.getComputedStyle(el).getPropertyValue('background-color')
        setColor(varColor)
    }, [ref])

    return (
        <table className="table w-100" ref={ref}>
            <tbody>
                <tr>
                    <td className="text-body-secondary">HEX:</td>
                    <td className="font-weight-bold">{rgbToHex(color)}</td>
                </tr>
                <tr>
                    <td className="text-body-secondary">RGB:</td>
                    <td className="font-weight-bold">{color}</td>
                </tr>
            </tbody>
        </table>
    )
}

const ThemeColor = ({ className, children }) => {
    const classes = classNames(className, 'theme-color w-75 rounded mb-3')
    return (
        <CCol xs={12} sm={6} md={4} xl={2} className="mb-4">
            <div className={classes} style={{ paddingTop: '75%' }}></div>
            {children}
            <ThemeView />
        </CCol>
    )
}

ThemeColor.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
}

import { Table} from 'rsuite'
import TrialComponent from './TrialComponent.jsx'
import TrialActivations from './TrialActivations.jsx'
// import { mockUsers } from '../../../data/mock';


const AllTrials = () => {
    
    return (
        <>
            <div>
                <AppSidebar />
                <div className="wrapper d-flex flex-column min-vh-100">
                    <AppHeader />
                    <div className="body flex-grow-1 p-2">
                        <Tabs defaultActiveKey="1" style={{ marginTop: "-30px" }}>
                            <Tabs.Tab eventKey="1" title="Trial Customer">
                                <TrialComponent />
                            </Tabs.Tab>
                            <Tabs.Tab eventKey="2" title="Trial Activation">
                                <TrialActivations />
                            </Tabs.Tab>
                        </Tabs>
                    </div>
                    <AppFooter />
                </div>
            </div>

        </>
    )
}

export default AllTrials
