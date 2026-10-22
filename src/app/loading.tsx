
// Estado temporário exibido durante a navegação no App Router.
// Apresenta uma estrutura visual enquanto os dados da página são carregados.
export default function Loading() {
  return (
    // Container principal da tela de carregamento.
    // A classe animate-pulse cria o efeito visual de pulsação.
    <div className="mx-auto w-full max-w-7xl animate-pulse space-y-5" role="status" aria-live="polite">

      {/* Mensagem acessível para leitores de tela, informando
          que os dados da plataforma estão sendo carregados. */}
      <span className="sr-only">Carregando os dados da plataforma...</span>

      {/* Elementos que simulam o título e a descrição da página
          antes da exibição do conteúdo real. */}
      <div className="h-8 w-64 max-w-full rounded-lg bg-[#20323c]" />
      <div className="h-4 w-full max-w-xl rounded bg-[#1d2d36]" />

      {/* Cria quatro cartões temporários que representam
          os indicadores estatísticos apresentados no dashboard. */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="panel h-32 p-5"><div className="h-3 w-20 rounded bg-[#30424c]" /><div className="mt-8 h-8 w-24 max-w-full rounded bg-[#2c414a]" /></div>
        ))}
      </div>

      {/* Simula dois painéis maiores, utilizados para gráficos
          ou outras informações enquanto a página é carregada. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel h-72" />
        <div className="panel h-72" />
      </div>
    </div>
  );
}
