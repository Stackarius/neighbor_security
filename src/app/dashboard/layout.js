import Sidebar from "@/component/Sidebar";


export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }) {
  return (    
      <div className="flex min-h-screen">
      <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
  );
}
