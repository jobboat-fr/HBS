import { redirect } from "next/navigation";

/**
 * `/quiz` promettait un test « bientôt disponible ». Il existe — mais il commence par une
 * demande, parce que l'organisme doit établir le niveau du candidat avant de l'inscrire
 * (indicateur 8) et qu'un test anonyme ne se rattache à personne. Cette route reste pour
 * les liens déjà en circulation et mène là où le parcours commence réellement.
 */
export default function QuizPage() {
  redirect("/preinscription");
}
