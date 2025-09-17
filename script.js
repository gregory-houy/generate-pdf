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
            .select('nom, prenom, username, password, classe, code'); // Ajout des colonnes classe et code
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
        // Crée le contenu d'une seule page pour un adhérent
        const pageContent = [
            // Contenu du document, stylisé pour correspondre à votre modèle
            { text: 'Lycée', style: 'header' },
            { text: 'CHÂTEAU BLANC', style: 'subheader' },
            { text: `Nom: ${adherent.nom}`, margin: [0, 20, 0, 5] },
            { text: `Prénom: ${adherent.prenom}`, margin: [0, 0, 0, 5] },
            { text: `Classe: ${adherent.classe}`, margin: [0, 0, 0, 5] },
            { text: `Identifiant: ${adherent.username}`, margin: [0, 20, 0, 5] },
            { text: `Mot de passe: ${adherent.password}`, margin: [0, 0, 0, 5] },
            { text: `Code unique: ${adherent.code}`, margin: [0, 0, 0, 5] },
            // S'il s'agit du dernier adhérent, ne pas ajouter de saut de page
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
        }
    };

    // Définition explicite des polices pour le document
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
    // Crée le PDF et le télécharge sous le nom 'Fiches_Adherents.pdf'
    pdfMake.createPdf(docDefinition).download('Fiches_Adherents.pdf');
}

document.getElementById('generateBtn').addEventListener('click', generatePDFs);
