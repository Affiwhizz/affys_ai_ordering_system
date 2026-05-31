/**
 * Área Metropolitana de Lisboa (AML), 18 municipalities, 118 parishes.
 *
 * Each municipality has a placeholder delivery fee, these are first-pass
 * guesses based on distance from central Lisbon. Adjust in the admin
 * "Delivery zones" panel later. Once you have a real rate sheet, replace
 * the `baseFee` values below (or wire to a Supabase table).
 */

export interface AMLParish {
  name: string;
}

export interface AMLMunicipality {
  key: string;        // slug for storage / forms
  name: string;       // display name
  baseFee: number;    // delivery fee in EUR
  parishes: AMLParish[];
}

export interface AMLRegion {
  key: string;
  label: string;       // customer-facing label
  municipalities: AMLMunicipality[];
}

export const AML: AMLRegion = {
  key: "aml",
  label: "Lisbon Metropolitan Area",
  municipalities: [
    {
      key: "alcochete",
      name: "Alcochete",
      baseFee: 25,
      parishes: [
        { name: "Alcochete" },
        { name: "Samouco" },
        { name: "São Francisco" },
      ],
    },
    {
      key: "almada",
      name: "Almada",
      baseFee: 15,
      parishes: [
        { name: "Almada, Cova da Piedade, Pragal e Cacilhas" },
        { name: "Caparica e Trafaria" },
        { name: "Charneca de Caparica e Sobreda" },
        { name: "Costa de Caparica" },
        { name: "Laranjeiro e Feijó" },
      ],
    },
    {
      key: "amadora",
      name: "Amadora",
      baseFee: 7,
      parishes: [
        { name: "Águas Livres" },
        { name: "Alfragide" },
        { name: "Encosta do Sol" },
        { name: "Falagueira-Venda Nova" },
        { name: "Mina de Água" },
        { name: "Venteira" },
      ],
    },
    {
      key: "barreiro",
      name: "Barreiro",
      baseFee: 18,
      parishes: [
        { name: "Alto do Seixalinho, Santo André e Verderena" },
        { name: "Barreiro e Lavradio" },
        { name: "Palhais e Coina" },
        { name: "Santo António da Charneca" },
      ],
    },
    {
      key: "cascais",
      name: "Cascais",
      baseFee: 22,
      parishes: [
        { name: "Alcabideche" },
        { name: "Carcavelos e Parede" },
        { name: "Cascais e Estoril" },
        { name: "São Domingos de Rana" },
      ],
    },
    {
      key: "lisboa",
      name: "Lisboa",
      baseFee: 12,
      parishes: [
        { name: "Ajuda" },
        { name: "Alcântara" },
        { name: "Alvalade" },
        { name: "Areeiro" },
        { name: "Arroios" },
        { name: "Avenidas Novas" },
        { name: "Beato" },
        { name: "Belém" },
        { name: "Benfica" },
        { name: "Campo de Ourique" },
        { name: "Campolide" },
        { name: "Carnide" },
        { name: "Estrela" },
        { name: "Lumiar" },
        { name: "Marvila" },
        { name: "Misericórdia" },
        { name: "Olivais" },
        { name: "Parque das Nações" },
        { name: "Penha de França" },
        { name: "Santa Clara" },
        { name: "Santa Maria Maior" },
        { name: "Santo António" },
        { name: "São Domingos de Benfica" },
        { name: "São Vicente" },
      ],
    },
    {
      key: "loures",
      name: "Loures",
      baseFee: 14,
      parishes: [
        { name: "Bucelas" },
        { name: "Camarate, Unhos e Apelação" },
        { name: "Fanhões" },
        { name: "Loures" },
        { name: "Lousa" },
        { name: "Moscavide e Portela" },
        { name: "Sacavém e Prior Velho" },
        { name: "Santa Iria de Azoia, São João da Talha e Bobadela" },
        { name: "Santo Antão e São Julião do Tojal" },
        { name: "Santo António dos Cavaleiros e Frielas" },
      ],
    },
    {
      key: "mafra",
      name: "Mafra",
      baseFee: 25,
      parishes: [
        { name: "Azueira e Sobral da Abelheira" },
        { name: "Carvoeira" },
        { name: "Encarnação" },
        { name: "Enxara do Bispo, Gradil e Vila Franca do Rosário" },
        { name: "Ericeira" },
        { name: "Igreja Nova e Cheleiros" },
        { name: "Mafra" },
        { name: "Malveira e São Miguel de Alcainça" },
        { name: "Milharado" },
        { name: "Santo Isidoro" },
        { name: "Venda do Pinheiro e Santo Estêvão das Galés" },
      ],
    },
    {
      key: "moita",
      name: "Moita",
      baseFee: 22,
      parishes: [
        { name: "Alhos Vedros" },
        { name: "Baixa da Banheira e Vale da Amoreira" },
        { name: "Gaio-Rosário e Sarilhos Pequenos" },
        { name: "Moita" },
      ],
    },
    {
      key: "montijo",
      name: "Montijo",
      baseFee: 25,
      parishes: [
        { name: "Atalaia e Alto Estanqueiro-Jardia" },
        { name: "Canha" },
        { name: "Montijo e Afonsoeiro" },
        { name: "Pegões" },
        { name: "Sarilhos Grandes" },
      ],
    },
    {
      key: "odivelas",
      name: "Odivelas",
      baseFee: 10,
      parishes: [
        { name: "Odivelas" },
        { name: "Pontinha e Famões" },
        { name: "Póvoa de Santo Adrião e Olival Basto" },
        { name: "Ramada e Caneças" },
      ],
    },
    {
      key: "oeiras",
      name: "Oeiras",
      baseFee: 12,
      parishes: [
        { name: "Algés, Linda-a-Velha e Cruz Quebrada/Dafundo" },
        { name: "Barcarena" },
        { name: "Carnaxide e Queijas" },
        { name: "Oeiras e São Julião da Barra, Paço de Arcos e Caxias" },
        { name: "Porto Salvo" },
      ],
    },
    {
      key: "palmela",
      name: "Palmela",
      baseFee: 30,
      parishes: [
        { name: "Palmela" },
        { name: "Pinhal Novo" },
        { name: "Poceirão e Marateca" },
        { name: "Quinta do Anjo" },
      ],
    },
    {
      key: "seixal",
      name: "Seixal",
      baseFee: 18,
      parishes: [
        { name: "Amora" },
        { name: "Corroios" },
        { name: "Fernão Ferro" },
        { name: "Seixal, Arrentela e Aldeia de Paio Pires" },
      ],
    },
    {
      key: "sesimbra",
      name: "Sesimbra",
      baseFee: 28,
      parishes: [
        { name: "Castelo" },
        { name: "Quinta do Conde" },
        { name: "Santiago" },
      ],
    },
    {
      key: "setubal",
      name: "Setúbal",
      baseFee: 30,
      parishes: [
        { name: "Azeitão" },
        { name: "Gâmbia-Pontes-Alto da Guerra" },
        { name: "Sado" },
        { name: "Setúbal" },
        { name: "São Sebastião" },
      ],
    },
    {
      key: "sintra",
      name: "Sintra",
      baseFee: 17,
      parishes: [
        { name: "Agualva e Mira-Sintra" },
        { name: "Algueirão-Mem Martins" },
        { name: "Almargem do Bispo, Pero Pinheiro e Montelavar" },
        { name: "Cacém e São Marcos" },
        { name: "Casal de Cambra" },
        { name: "Colares" },
        { name: "Massamá e Monte Abraão" },
        { name: "Queluz e Belas" },
        { name: "Rio de Mouro" },
        { name: "Santa Maria e São Miguel, São Martinho e São Pedro de Penaferrim" },
        { name: "São João das Lampas e Terrugem" },
      ],
    },
    {
      key: "vila-franca-de-xira",
      name: "Vila Franca de Xira",
      baseFee: 22,
      parishes: [
        { name: "Alhandra, São João dos Montes e Calhandriz" },
        { name: "Alverca do Ribatejo e Sobralinho" },
        { name: "Castanheira do Ribatejo e Cachoeiras" },
        { name: "Póvoa de Santa Iria e Forte da Casa" },
        { name: "Vialonga" },
        { name: "Vila Franca de Xira" },
      ],
    },
  ],
};

/** Outside-AML option for orders beyond the metro area. */
export const OUTSIDE_AML = {
  key: "outside-aml",
  label: "Rest of Portugal (30+ km via Rodomail)",
  baseFee: 25,
  note: "From €25, final fee shared after weight check.",
};

export function getMunicipality(key: string): AMLMunicipality | undefined {
  return AML.municipalities.find((m) => m.key === key);
}
