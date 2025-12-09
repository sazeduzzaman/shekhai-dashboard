import React, { useState } from 'react';
import { 
    Container, 
    Card, 
    CardBody, 
    Row, 
    Col, 
    Nav, 
    NavItem, 
    NavLink, 
    TabContent, 
    TabPane,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    ListGroup,
    ListGroupItem,
    Badge
} from 'reactstrap';
import classnames from 'classnames';
import Breadcrumb from '../../components/Common/Breadcrumb'; // Assuming you have this component

const Settings = () => {
    document.title = "Admin Settings";
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    // Placeholder content components for each tab
    const GeneralSettings = () => (
        <Form>
            <h5 className="mb-4">Branding & Appearance</h5>
            <FormGroup>
                <Label for="siteName">Site Name</Label>
                <Input type="text" id="siteName" placeholder="Enter dashboard name" defaultValue="Shekhai Admin" />
            </FormGroup>
            <FormGroup>
                <Label for="logoUpload">Upload Logo</Label>
                <Input type="file" id="logoUpload" />
                <small className="text-muted">Max file size 2MB (PNG/SVG recommended)</small>
            </FormGroup>
            <hr />
            <h5 className="mb-4">Localization</h5>
            <FormGroup>
                <Label for="defaultLanguage">Default Language</Label>
                <Input type="select" id="defaultLanguage">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                </Input>
            </FormGroup>
            <Button color="primary" className="mt-3">Save General Settings</Button>
        </Form>
    );

    const UserManagement = () => (
        <>
            <h5 className="mb-4">Manage User Roles</h5>
            <p className="text-muted">Configure permissions and access levels for different user groups.</p>
            <ListGroup>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Administrator 
                    <Badge color="success" pill>Full Access</Badge>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Editor 
                    <Badge color="info" pill>Content Only</Badge>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Viewer 
                    <Badge color="secondary" pill>Read Only</Badge>
                </ListGroupItem>
            </ListGroup>
            <hr />
            <h5 className="mb-4 mt-4">Registration Settings</h5>
            <FormGroup switch>
                <Input type="switch" defaultChecked />
                <Label check>Allow Public Registration</Label>
            </FormGroup>
        </>
    );

    const SecuritySettings = () => (
        <Form>
            <h5 className="mb-4">Authentication</h5>
            <FormGroup switch>
                <Input type="switch" defaultChecked />
                <Label check>Enable Two-Factor Authentication (2FA)</Label>
            </FormGroup>
            <FormGroup switch>
                <Input type="switch" />
                <Label check>Require Strong Passwords</Label>
            </FormGroup>
            <hr />
            <h5 className="mb-4">Session Management</h5>
            <FormGroup>
                <Label for="sessionTimeout">Session Timeout (minutes)</Label>
                <Input type="number" id="sessionTimeout" defaultValue="60" min="5" />
            </FormGroup>
            <Button color="primary" className="mt-3">Save Security Settings</Button>
        </Form>
    );

    const SystemSettings = () => (
        <>
            <h5 className="mb-4">System Health & Logging</h5>
            <Button color="secondary" outline className="me-2">Download Error Logs</Button>
            <Button color="secondary" outline>View System Status</Button>
            <hr />
            <h5 className="mb-4 mt-4">API Keys</h5>
            <p className="text-muted">Manage integration keys for external services.</p>
            <ListGroup>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Stripe Payment Key (Active)
                    <Button size="sm" color="warning" outline>Revoke</Button>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                    Google Maps API (Inactive)
                    <Button size="sm" color="success" outline>Generate New</Button>
                </ListGroupItem>
            </ListGroup>
        </>
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    <Breadcrumb title="Dashboard" breadcrumbItem="Settings" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <h4 className="card-title mb-4">Admin Dashboard Settings</h4>

                                    <Row>
                                        {/* Left Column: Navigation Tabs */}
                                        <Col md={3}>
                                            <Nav pills vertical className="settings-nav">
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === '1' })}
                                                        onClick={() => { toggle('1'); }}
                                                    >
                                                        <i className="fas fa-cog me-2"></i> General & Branding
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === '2' })}
                                                        onClick={() => { toggle('2'); }}
                                                    >
                                                        <i className="fas fa-users me-2"></i> User Management
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === '3' })}
                                                        onClick={() => { toggle('3'); }}
                                                    >
                                                        <i className="fas fa-shield-alt me-2"></i> Security & Auth
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === '4' })}
                                                        onClick={() => { toggle('4'); }}
                                                    >
                                                        <i className="fas fa-server me-2"></i> System & API
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </Col>

                                        {/* Right Column: Tab Content */}
                                        <Col md={9} className="border-start p-4">
                                            <TabContent activeTab={activeTab}>
                                                <TabPane tabId="1">
                                                    <GeneralSettings />
                                                </TabPane>
                                                <TabPane tabId="2">
                                                    <UserManagement />
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    <SecuritySettings />
                                                </TabPane>
                                                <TabPane tabId="4">
                                                    <SystemSettings />
                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Settings;