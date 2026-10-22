
"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

// Componente responsável por apresentar uma mensagem de erro
// quando ocorre alguma falha durante a renderização da página.
// A função reset permite tentar carregar o conteúdo novamente.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    // Exibe uma seção de alerta informando que ocorreu um erro.
    <section className="panel mx-auto mt-8 max-w-xl px-6 py-12 text-center" role="alert">

      {/* Ícone visual para destacar a ocorrência de um erro. */}
      <AlertTriangle size={36} className="mx-auto text-[#ff7782]" />

      {/* Mensagem principal apresentada ao usuário. */}
      <h1 className="mt-5 text-2xl font-black">Não foi possível carregar esta página.</h1>

      {/* Orienta o usuário a tentar novamente e verificar
          os arquivos JSON caso o problema continue. */}
      <p className="mt-3 text-sm leading-6 text-[#a6bac1]">
        Ocorreu um erro ao apresentar os dados. Tente novamente; se persistir, verifique se os arquivos JSON estão disponíveis em public/dados.
      </p>

      {/* Executa a função reset para tentar renderizar novamente
          a parte da aplicação que apresentou o erro. */}
      <button onClick={reset} type="button" className="btn-primary mt-7"><RotateCcw size={16} /> Tentar novamente</button>
    </section>
  );
}
