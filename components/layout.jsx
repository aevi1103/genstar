import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, Menu } from "antd";
import routes from "../utils/routes";

const { SubMenu } = Menu;
const { Header, Content } = Layout;

function AppLayout({ children }) {
  const { pathname } = useRouter();
  return (
    <>
      <Head>
        <title>Genstar</title>
      </Head>
      <Layout>
        <Header>
          <div className="float-left mr-5">
            <span className="text-white font-bold">GENSTAR</span>
          </div>
          <Menu theme="dark" mode="horizontal" selectedKeys={[pathname]}>
            {routes.map(({ title, path, submenu }) =>
              submenu.length === 0 ? (
                <Menu.Item key={path}>
                  <Link href={path}>{title}</Link>
                </Menu.Item>
              ) : (
                <SubMenu key={path} title={title}>
                  {submenu.map((item) => (
                    <Menu.Item key={item.path}>
                      <Link href={item.path}>{item.title}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              )
            )}
          </Menu>
        </Header>
        <Content className="m-5 p-5 bg-white">{children}</Content>
        {/* <Footer className="text-center">Genstar Footer</Footer> */}
      </Layout>
    </>
  );
}

export default AppLayout;
