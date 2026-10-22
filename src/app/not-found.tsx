
import Link from "next/link";
import { ArrowLeft, Crosshair } from "lucide-react";

// Componente responsável por apresentar a página de erro 404.
// É exibido quando o usuário acessa uma rota inexistente
// ou quando algum recurso solicitado não é encontrado.
export default function NotFound() {
  return (
    // Container principal da página de erro.
    // Centraliza os elementos e adapta o conteúdo a diferentes tamanhos de tela.
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">

      {/* Ícone decorativo que mantém a identidade visual
          do VALORANT.DATAS mesmo nas páginas de erro. */}
      <div className="grid size-16 place-items-center rounded-2xl border border-[#ff46555c] bg-[#ff465516] text-[#ff7782]">
        <Crosshair size={28} />
      </div>

      {/* Identifica o código do erro e informa
          que a rota solicitada não está disponível. */}
      <p className="eyebrow mt-6">Erro 404 · Rota indisponível</p>

      {/* Mensagem principal apresentada ao usuário. */}
      <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">Página não encontrada.</h1>

      {/* Explica possíveis motivos do erro e orienta
          o usuário sobre como continuar navegando. */}
      <p className="mt-4 max-w-md text-sm leading-7 text-[#a6b9c1]">
        A página pode ter sido movida ou o endereço foi digitado incorretamente. Você pode voltar à visão geral da plataforma.
      </p>

      {/* Botão de navegação que redireciona o usuário
          para a página inicial da aplicação. */}
      <Link href="/" className="btn-primary mt-7"><ArrowLeft size={16} /> Voltar à visão geral</Link>
    </section>
  );
}
