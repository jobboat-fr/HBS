import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { legal, site } from "@/lib/site";
import { echeancier, FORMATIONS, ORDRE, PACK, duree, euros } from "@/lib/commande";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Conditions générales de vente de HBS FORMATION : Analyse de données, Création de contenu, Marketing, La Forge IA et Pack 360 — prix, paiement en ligne, rétractation, annulation, financement OPCO et France Travail.",
  alternates: { canonical: "/cgv" },
};

/**
 * Les CGV décrivent ce que le tunnel d'achat fait réellement — et inversement : l'échéancier
 * affiché ici vient de `lib/commande.ts`, la même fonction qui programme les prélèvements.
 * Si l'un change sans l'autre, la page ment ou les prélèvements sont irréguliers.
 *
 * Deux régimes, parce que la loi en pose deux :
 * - l'entreprise signe une **convention** (L6353-1) : paiement à la commande possible ;
 * - le particulier qui paie lui-même signe un **contrat** (L6353-3) : délai de rétractation,
 *   aucune somme exigible avant son terme, 30 % au plus ensuite, solde échelonné (L6353-5, -6).
 *   Le délai retenu est de 14 jours : il couvre les 10 jours du Code du travail et les 14 jours
 *   du Code de la consommation pour un contrat conclu à distance.
 */
export default function CgvPage() {
  const e = echeancier(new Date("2026-10-01T10:00:00+02:00"));
  const pct = (n: number) => `${Math.round(n * 100)} %`;

  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Conditions générales de vente"
      version="Version en vigueur au 14 septembre 2026"
      intro={
        <p>
          Les présentes conditions régissent la vente des formations proposées par {legal.raisonSociale},{" "}
          {legal.formeJuridique}, au capital de {legal.capital}, dont le siège est situé {legal.siege},
          immatriculée au RCS {legal.rcs}, organisme de formation enregistré sous le n°{" "}
          {legal.numeroDeclarationActivite} auprès du {legal.declarationAutorite} (cet enregistrement ne vaut
          pas agrément de l&apos;État), certifié Qualiopi au titre de la catégorie « {legal.qualiopiCategorie} ».
          Contact : {site.email}.
        </p>
      }
      articles={[
        {
          id: "champ",
          titre: "Champ d'application",
          contenu: (
            <>
              <p>
                Les présentes conditions s&apos;appliquent à toute commande d&apos;une formation passée sur le
                site {site.url.replace("https://", "")} ou auprès de {legal.raisonSociale}, par :
              </p>
              <ul>
                <li>
                  <b>une entreprise ou un organisme</b> (le « Client professionnel ») pour un ou plusieurs de
                  ses collaborateurs — une convention de formation est alors conclue (art. L6353-1 du Code du
                  travail) ;
                </li>
                <li>
                  <b>une personne physique</b> qui s&apos;inscrit à titre individuel et à ses frais (le «
                  Client particulier ») — un contrat de formation professionnelle est alors conclu (art.
                  L6353-3 du Code du travail).
                </li>
              </ul>
              <p>
                Toute commande emporte l&apos;acceptation des présentes conditions, portées à la connaissance du
                Client avant la validation de sa commande. Elles prévalent sur tout autre document, sauf
                accord écrit contraire.
              </p>
            </>
          ),
        },
        {
          id: "offre",
          titre: "La formation",
          contenu: (
            <>
              <p>
                HBS FORMATION propose quatre formations, dispensées à distance en direct (ou en présentiel dans
                les locaux du Client professionnel sur accord), à raison de 7 heures par jour :
              </p>
              <ul>
                {ORDRE.map((c) => (
                  <li key={c}>
                    {FORMATIONS[c].nom} : {duree(FORMATIONS[c])} consécutifs ;
                  </li>
                ))}
              </ul>
              <p>
                ainsi que le {PACK.nom}, qui réunit les quatre formations d&apos;un même mois. Le programme,
                les objectifs, les prérequis, les modalités d&apos;évaluation et d&apos;accès de chaque formation
                sont décrits sur sa page, et les dates sur la page{" "}
                <Link href="/planning" className="text-teal-700 underline">Planning</Link> ; ces informations font
                partie intégrante du contrat ou de la convention.
              </p>
              <p>
                Chaque session réunit de 4 à 12 participants. L&apos;entrée en formation est précédée d&apos;un
                test de positionnement, qui permet d&apos;adapter le parcours au niveau et au projet du
                participant.
              </p>
              <p>
                À l&apos;issue de chaque formation, le participant reçoit une attestation de fin de formation. Pour
                La Forge IA, la réussite à l&apos;épreuve finale donne en outre lieu au Certificat La Forge IA
                délivré par {legal.raisonSociale}. Aucune de ces formations ne délivre de diplôme d&apos;État ni de
                certification enregistrée au RNCP ou au répertoire spécifique ; elles ne sont pas éligibles au
                compte personnel de formation.
              </p>
            </>
          ),
        },
        {
          id: "prix",
          titre: "Prix",
          contenu: (
            <>
              <p>
                Les prix par participant, toutes taxes comprises, sont les suivants :
              </p>
              <ul>
                {ORDRE.map((c) => (
                  <li key={c}>
                    {FORMATIONS[c].nom} : <b>{euros(FORMATIONS[c].prix)}</b>
                  </li>
                ))}
                <li>
                  {PACK.nom} (les quatre formations) : <b>{euros(PACK.prix)}</b>, soit une remise de 15 % sur Analyse de
                  données et sur Création de contenu, au lieu de {euros(PACK.prixSepare)}.
                </li>
              </ul>
              <p>
                Le prix comprend la formation, le test de positionnement, les supports et modèles remis,
                l&apos;évaluation, l&apos;attestation de fin de formation et le questionnaire de suivi à trois mois ;
                pour La Forge IA, il comprend aussi le Certificat La Forge IA en cas de réussite et la mise à
                disposition des outils IA présentés sur le site, dans les conditions précisées dans la convention
                ou le contrat.
              </p>
              <p>
                Les frais éventuels de déplacement pour une session en présentiel chez le Client
                professionnel font l&apos;objet d&apos;un devis préalable. Le prix applicable est celui affiché au
                jour de la commande.
              </p>
            </>
          ),
        },
        {
          id: "commande-pro",
          titre: "Commande et paiement — Client professionnel",
          contenu: (
            <>
              <p>
                Le Client professionnel choisit le nombre de places, renseigne sa raison sociale, son adresse
                de facturation et, le cas échéant, son numéro de TVA intracommunautaire, puis règle la
                commande en ligne par carte bancaire. Le paiement est exigible à la commande.
              </p>
              <p>
                La facture, émise par {legal.raisonSociale}, est adressée par courriel. La convention de
                formation est transmise au Client, qui la retourne signée avant le début de la session. Le
                Client communique le nom des participants au plus tard 7 jours avant la session.
              </p>
            </>
          ),
        },
        {
          id: "commande-particulier",
          titre: "Commande, rétractation et paiement — Client particulier",
          contenu: (
            <>
              <p>
                <b>Délai de rétractation.</b> Le Client particulier dispose d&apos;un délai de{" "}
                <b>14 jours</b> à compter de la conclusion du contrat pour se rétracter, sans motif ni frais,
                par courriel à {site.email} ou par lettre recommandée avec avis de réception. Ce délai inclut
                celui de 10 jours prévu à l&apos;article L6353-5 du Code du travail.
              </p>
              <p>
                <b>Aucun paiement pendant ce délai.</b> Lors de la réservation, le Client enregistre un moyen
                de paiement auprès de notre prestataire Stripe ; <b>aucune somme n&apos;est prélevée</b> avant
                l&apos;expiration du délai de rétractation (art. L6353-6 du Code du travail).
              </p>
              <p>
                <b>Échéancier.</b> À l&apos;expiration du délai, le prix est prélevé en trois fois, sur le moyen
                de paiement enregistré, que le Client autorise expressément :
              </p>
              <ul>
                <li>{pct(e[0].part)} du prix au lendemain de la fin du délai de rétractation ;</li>
                <li>{pct(e[1].part)} le premier jour de la formation (ou, s&apos;il est antérieur, le jour suivant la première échéance) ;</li>
                <li>{pct(e[2].part)} le dernier jour de la formation (ou, s&apos;il est antérieur, le jour suivant la deuxième échéance).</li>
              </ul>
              <p>
                Pour le {PACK.nom}, le premier jour est celui de la première formation du mois, et le dernier jour
                celui de la dernière.
              </p>
              <p>
                Le Client est informé par courriel avant chaque prélèvement. En cas d&apos;échec, un lien de
                paiement lui est adressé ; à défaut de régularisation sous 8 jours, {legal.raisonSociale} peut
                suspendre l&apos;accès à la formation.
              </p>
              <p>
                <b>Force majeure.</b> Si, par suite de force majeure dûment reconnue, le Client est empêché
                de suivre la formation, il peut résilier le contrat ; seules les prestations effectivement
                dispensées sont dues, au prorata de leur valeur (art. L6353-7 du Code du travail).
              </p>
            </>
          ),
        },
        {
          id: "financeur",
          titre: "Prise en charge par un financeur",
          contenu: (
            <>
              <p>
                Lorsque la formation est financée par un opérateur de compétences (OPCO), par France Travail
                ou par tout autre financeur, il appartient au Client d&apos;obtenir l&apos;accord de prise en
                charge <b>avant le début de la formation</b>. {legal.raisonSociale} fournit le devis, le
                programme et les pièces nécessaires. Aucun paiement en ligne n&apos;est alors demandé : la
                demande se fait depuis la page{" "}
                <Link href="/preinscription" className="text-teal-700 underline">Demander une place</Link>.
              </p>
              <p>
                En cas de subrogation, {legal.raisonSociale} facture directement le financeur. Toute part non
                prise en charge, ou refusée après la formation faute de justificatifs imputables au Client
                (notamment l&apos;assiduité), reste due par le Client.
              </p>
            </>
          ),
        },
        {
          id: "annulation-client",
          titre: "Report, remplacement et annulation par le Client",
          contenu: (
            <>
              <p>
                <b>Report.</b> Le Client peut demander, jusqu&apos;à 7 jours avant le début de la session, le
                report de sa place sur une session ultérieure, sans frais, dans la limite d&apos;un report.
              </p>
              <p>
                <b>Remplacement.</b> Le Client professionnel peut remplacer un participant par un autre
                collaborateur à tout moment avant le début de la session, sous réserve du test de
                positionnement.
              </p>
              <p>
                <b>Annulation par le Client professionnel.</b> Notifiée par écrit plus de 14 jours avant le
                début de la session, elle donne lieu au remboursement intégral. Notifiée ensuite, la place
                reste due, sauf report ou remplacement dans les conditions ci-dessus. Les sommes restant dues
                à ce titre ne peuvent être imputées sur la participation au développement de la formation
                professionnelle ni faire l&apos;objet d&apos;une demande de prise en charge.
              </p>
              <p>
                <b>Abandon en cours de formation.</b> Pour le Client particulier, les règles de l&apos;article
                précédent s&apos;appliquent. Pour le Client professionnel, les heures non suivies du fait du
                participant restent dues.
              </p>
            </>
          ),
        },
        {
          id: "annulation-organisme",
          titre: "Report ou annulation par l'organisme",
          contenu: (
            <p>
              {legal.raisonSociale} peut reporter ou annuler une session, notamment si moins de 4 participants
              sont inscrits, au plus tard 7 jours avant son début (sauf force majeure). Le Client choisit alors
              entre la nouvelle date proposée et le <b>remboursement intégral</b> des sommes versées, effectué
              sous 14 jours. Aucune autre indemnité n&apos;est due.
            </p>
          ),
        },
        {
          id: "deroulement",
          titre: "Déroulement, assiduité et évaluation",
          contenu: (
            <p>
              Le participant s&apos;engage à suivre l&apos;ensemble des ateliers et à émarger à chaque demi-journée.
              Il respecte le règlement intérieur qui lui est communiqué. Les acquis sont évalués à chaque
              atelier et lors d&apos;une épreuve pratique finale ; un questionnaire de satisfaction et un
              questionnaire de suivi à trois mois lui sont adressés. En cas de situation de handicap, les
              aménagements nécessaires sont étudiés avec lui avant l&apos;entrée en formation.
            </p>
          ),
        },
        {
          id: "propriete",
          titre: "Propriété intellectuelle",
          contenu: (
            <p>
              Les supports, exercices et contenus remis pendant la formation sont la propriété de{" "}
              {legal.raisonSociale} ou de ses partenaires. Ils sont concédés au participant pour son usage
              personnel et professionnel ; toute reproduction, diffusion ou exploitation commerciale est
              interdite sans autorisation écrite. Les documents apportés par le participant et le dossier IA
              qu&apos;il constitue restent sa propriété.
            </p>
          ),
        },
        {
          id: "donnees",
          titre: "Données personnelles",
          contenu: (
            <p>
              Les données recueillies lors de la commande sont traitées par {legal.raisonSociale} pour
              l&apos;exécution du contrat, le suivi administratif et pédagogique et le respect de ses
              obligations légales. Le paiement est traité par Stripe, qui agit comme prestataire de paiement ;{" "}
              {legal.raisonSociale} n&apos;a jamais accès aux données complètes de la carte. Les modalités et vos
              droits sont décrits dans la{" "}
              <Link href="/confidentialite" className="text-teal-700 underline">politique de confidentialité</Link>.
            </p>
          ),
        },
        {
          id: "reclamations",
          titre: "Réclamations et médiation",
          contenu: (
            <>
              <p>
                Toute réclamation peut être adressée à {site.email}. {legal.raisonSociale} en accuse réception
                sous 48 heures ouvrées et y répond sous 15 jours.
              </p>
              <p>
                Le Client particulier, consommateur, peut recourir gratuitement à un médiateur de la
                consommation en vue de la résolution amiable d&apos;un litige, après une réclamation écrite
                restée sans réponse satisfaisante (art. L612-1 du Code de la consommation).{" "}
                {legal.mediateur
                  ? <>Médiateur compétent : {legal.mediateur}.</>
                  : <>Les coordonnées du médiateur sont communiquées sur simple demande à {site.email}.</>}
              </p>
            </>
          ),
        },
        {
          id: "droit",
          titre: "Droit applicable et litiges",
          contenu: (
            <p>
              Les présentes conditions sont soumises au droit français. À défaut de résolution amiable, tout
              litige avec un Client professionnel relève des tribunaux de Rouen. Le Client particulier peut
              saisir la juridiction du lieu où il demeurait au moment de la conclusion du contrat ou de la
              survenance du fait dommageable.
            </p>
          ),
        },
      ]}
    />
  );
}
