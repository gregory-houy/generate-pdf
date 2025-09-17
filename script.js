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
            { text: 'Lycée', style: 'header' },
            { text: 'CHÂTEAU BLANC', style: 'subheader' },
            { text: `Nom: ${adherent.nom}`, margin: [0, 20, 0, 5] },
            { text: `Prénom: ${adherent.prenom}`, margin: [0, 0, 0, 5] },
            { text: `Classe: ${adherent.classe}`, margin: [0, 0, 0, 5] },
            { text: `Identifiant: ${adherent.username}`, margin: [0, 20, 0, 5] },
            { text: `Mot de passe: ${adherent.password}`, margin: [0, 0, 0, 5] },
            { text: `Code unique: ${adherent.code}`, margin: [0, 0, 0, 5] },
            ...(index < adherents.length - 1 ? [{ text: '', pageBreak: 'after' }] : [])
        ];
        documentContent.push(...pageContent);
    });

    const docDefinition = {
        content: documentContent,
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 5, 0, 15]
            }
        },
        defaultStyle: {
            // S'assurer que le style par défaut utilise les polices que vous définissez
            font: 'Helvetica'
        },
        fonts: {
            Helvetica: {
                normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Helvetica/Helvetica.ttf',
                bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Helvetica/Helvetica-Bold.ttf',
                italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Helvetica/Helvetica-Oblique.ttf',
                bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Helvetica/Helvetica-BoldOblique.ttf'
            }
        }
    };

    pdfMake.createPdf(docDefinition).download('Fiches_Adherents.pdf');
}

document.getElementById('generateBtn').addEventListener('click', generatePDFs);
