import Link from "next/link";
import {Container,Panel,PageHeader} from "@/components/ui";
export const metadata={title:'Equipe MuBanneD'};
export default function Page(){return <Container><PageHeader title='Equipe MuBanneD'/><Panel><p className="leading-7">Precisa falar com a administração? Use o suporte oficial para assuntos de conta, denúncias, bugs e dúvidas. A equipe nunca solicita sua senha. A relação pública de integrantes será divulgada pela administração.</p><Link href="/suporte" className="btn btn-gold mt-6">Falar com o suporte</Link></Panel></Container>}