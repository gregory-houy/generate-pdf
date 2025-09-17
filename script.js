// Import the Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Mettez à jour ces valeurs avec vos propres clés
const supabaseUrl = 'https://iarukjyswplvmtcxjtbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcnVranlzd3Bsdm10Y3hqdGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTYwMjUsImV4cCI6MjA3MTYzMjAyNX0.jC33JZm5vwOROpxEMBCRQTaGwe-TF06fRMHg1UcoHxY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchAdherents() {
    try {
        const { data, error } = await supabase
            .from('adherents')
            .select('nom, prenom, identifiant, mot_de_passe');
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

    adherents.forEach(adherent => {
        const docDefinition = {
            content: [
                { text: 'Lycée', style: 'header' },
                { text: 'CHÂTEAU BLANC', style: 'subheader' },
                { text: `Nom: ${adherent.nom}`, margin: [0, 20, 0, 5] },
                { text: `Prénom: ${adherent.prenom}`, margin: [0, 0, 0, 5] },
                { text: `Identifiant: ${adherent.identifiant}`, margin: [0, 20, 0, 5] },
                { text: `Mot de passe: ${adherent.mot_de_passe}`, margin: [0, 0, 0, 5] },
            ],
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
            pageBreakBefore: function (currentNode, pageNumber) {
                return pageNumber > 1;
            }
        };

        // Crée et ouvre le PDF dans un nouvel onglet
        pdfMake.createPdf(docDefinition).open();
    });
}

// On récupère le bouton par son ID et on attache l'écouteur d'événement
document.getElementById('generateBtn').addEventListener('click', generatePDFs);
