import NafalLoginForm from "@/components/backoffice/login/NafalLoginForm";
import NafalLoginFooter from "@/components/backoffice/login/NafalLoginFooter";
import NafalLoginHeader from "@/components/backoffice/login/NafalLoginHeader";

export default function ProductPage() {
  return (
    <div className="bg-whtie-100 min-h-screen">
      <NafalLoginHeader />
        <NafalLoginForm />
        <NafalLoginFooter />

    </div>
  );
}