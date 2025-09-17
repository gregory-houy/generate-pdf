// Importation du client Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Mettez à jour ces valeurs avec vos propres clés
const supabaseUrl = 'https://iarukjyswplvmtcxjtbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcnVranlzd3Bsdm10Y3hqdGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTYwMjUsImV4cCI6MjA3MTYzMjAyNX0.jC33JZm5vwOROpxEMBCRQTaGwe-TF06fRMHg1UcoHxY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchAdherents() {
    try {
        const { data, error } = await supabase
            .from('adherents')
            .select('nom, prenom, username, password, classe, code');
        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Erreur lors de la récupération des adhérents :", err);
        return [];
    }
}

async function generatePDFs() {
    const adherents = await fetchAdherents();

    if (adherents.length === 0) {
        alert("Aucun adhérent trouvé.");
        return;
    }

    const documentContent = [];

    adherents.forEach((adherent, index) => {
        const pageContent = [
            { text: `Lycée` },
            { text: `CHÂTEAU BLANC` },
            { text: `Nom: ${adherent.nom}` },
            { text: `Prénom: ${adherent.prenom}` },
            { text: `Classe: ${adherent.classe}` },
            { text: `Identifiant: ${adherent.username}` },
            { text: `Mot de passe: ${adherent.password}` },
            { text: `Code unique: ${adherent.code}` },
            ...(index < adherents.length - 1 ? [{ text: '', pageBreak: 'after' }] : [])
        ];
        documentContent.push(...pageContent);
    });

    const docDefinition = {
        content: documentContent
    };

    pdfMake.createPdf(docDefinition).download('Fiches_Adherents.pdf');
}

document.getElementById('generateBtn').addEventListener('click', generatePDFs);
