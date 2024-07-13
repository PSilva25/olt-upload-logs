import React from "react";
import { Layout, Menu } from "antd";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import "./App.css";

const { Header, Content, Footer } = Layout;

const App = () => (
  <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">Upload</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">
        <FileUpload />
        <DataTable />
      </div>
    </Content>
    <Footer style={{ textAlign: "center" }}>File Upload ©2024</Footer>
  </Layout>
);

export default App;
