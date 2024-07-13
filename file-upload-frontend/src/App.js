import React from "react";
import { Layout } from "antd";
import DataTable from "./components/DataTable";
import "./App.css";

const { Header, Content, Footer } = Layout;

const App = () => (
  <Layout className="layout">
    <Header style={{ display: "flex", alignItems: "center" }}>
      <h2 style={{ color: "white" }}>Faça o upload do arquivo de log</h2>
    </Header>
    <Content style={{ padding: "0 0px" }}>
      <div className="site-layout-content">
        <DataTable />
      </div>
    </Content>
    <Footer style={{ textAlign: "center" }}>Developed by: Rafael PSilva - OLT File Upload ©2024</Footer>
  </Layout>
);

export default App;