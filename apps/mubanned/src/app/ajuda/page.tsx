import Link from "next/link";
import {Container,Panel,PageHeader} from "@/components/ui";
export const metadata={title:'Ajuda e tutoriais'};
export default function Page(){return <Container><PageHeader title='Ajuda e tutoriais'/><Panel><p className="leading-7">Crie sua conta, consulte a página de downloads e acompanhe os eventos. Para dúvidas sobre acesso, itens ou denúncias, abra um ticket no suporte. A equipe acompanha as solicitações pelo painel administrativo.</p><Link href="/suporte" className="btn btn-gold mt-6">Falar com o suporte</Link></Panel></Container>}