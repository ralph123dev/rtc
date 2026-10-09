import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PolitiqueConfidentialiteScreen() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="chevron-back" size={20} color="#0F3D87" />
        </Pressable>

        <Image
          source={require('../../assets/images/img/rtc.png')}
          contentFit="contain"
          accessibilityLabel="RTC logo"
          style={styles.logo}
        />
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Politique de{'\n'}confidentialité</Text>

        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.headingBold}>
            POLITIQUE SUR LA CONFIDENTIALITÉ ET LA PROTECTION DES RENSEIGNEMENTS PERSONNELS
          </Text>

          <Text style={[styles.metaText, styles.marginTop]}>Numéro : P— 034</Text>
          <Text style={[styles.metaText, styles.marginBottom]}>
            Approuvée par : Conseil d'administration
          </Text>

          {/* Section 1 */}
          <Text style={styles.sectionTitle}>1. Objet général</Text>
          <Text style={styles.paragraph}>
            La présente politique vise à assurer la sécurité et la protection des renseignements
            personnels ou confidentiels détenus par le Réseau de transport de la Capitale (RTC) contre
            la consultation, l'utilisation ou la divulgation non autorisées de ceux-ci. Elle vise
            également la protection de ces renseignements contre toute atteinte à leur intégrité.
          </Text>
          <Text style={styles.paragraph}>
            De plus, la présente politique a pour objet de déterminer les règles relatives à la
            disponibilité de ces renseignements, à leur conservation ainsi qu'aux droits d'accès, de
            rectification et de destruction.
          </Text>

          {/* Section 2 */}
          <Text style={styles.sectionTitle}>2. Fondement</Text>
          <Text style={styles.paragraph}>
            Le RTC est un organisme public assujetti notamment à la Loi sur l'accès aux documents des
            organismes publics et sur la protection des renseignements personnels (RLRQ, c. A-2.1), à
            la Loi sur les archives (RLRQ, c. A-21.1), à la Loi concernant le cadre juridique des
            technologies de l'information (RLRQ, c. C-1.1) et au Code civil du Québec (RLRQ, 1991, c.
            64).
          </Text>
          <Text style={styles.paragraph}>
            Le RTC reconnaît l'importance de la protection de la vie privée, de la sécurité et de la
            protection des renseignements personnels ou confidentiels qu'il recueille et conserve. Il
            s'engage ainsi à respecter les dispositions, les valeurs et les principes fondamentaux
            établis par les législations applicables.
          </Text>
          <Text style={styles.paragraph}>
            Le RTC s'assure de mettre en oeuvre les mesures nécessaires pour garantir le respect de la
            confidentialité des renseignements personnels ou confidentiels qui lui sont communiqués dans
            le cours de ses activités.
          </Text>

          {/* Section 3 */}
          <Text style={styles.sectionTitle}>3. Champ d'application</Text>
          <Text style={styles.paragraph}>
            La présente politique s'applique à tous les employés et mandataires du RTC qui peuvent avoir
            accès, dans le cadre de l'exécution de leurs fonctions, à des renseignements personnels ou
            confidentiels.
          </Text>

          {/* Section 4 */}
          <Text style={styles.sectionTitle}>4. Objectifs</Text>
          <Text style={styles.paragraph}>
            La présente politique vise à définir par quels moyens le RTC protège les renseignements
            personnels ou confidentiels.
          </Text>
          <Text style={styles.paragraph}>
            Elle précise également les normes de collecte, de conservation, d'utilisation, de
            communication, de destruction de ces renseignements ainsi que les droits d'accès et de
            rectification des renseignements personnels.
          </Text>

          {/* Section 5 */}
          <Text style={styles.sectionTitle}>5. Définitions</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Renseignement personnel :</Text>{'\n'}
            Tout renseignement qui concerne une personne physique, qui permet de l'identifier et qui n'a
            pas un caractère public au sens de la Loi sur l'accès aux documents des organismes publics
            et sur la protection des renseignements personnels. Ces renseignements peuvent être
            notamment l'adresse personnelle, le numéro de téléphone personnel ou des renseignements
            concernant l'état de santé d'une personne physique;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Renseignement confidentiel :</Text>{'\n'}
            Tout renseignement de nature tactique ou stratégique pour le RTC, pour son auteur ou pour son
            propriétaire, ou tout renseignement habituellement traité de façon confidentielle par ces
            derniers, tels que des renseignements à caractère financier ou commercial. Un renseignement
            confidentiel ne comprend pas un renseignement pour lequel les lois applicables dans le
            secteur public prévoient qu'il acquière un caractère public lorsqu'il est détenu par le RTC.
          </Text>

          {/* Section 6 */}
          <Text style={styles.sectionTitle}>6. Règles et procédures applicables</Text>

          <Text style={styles.subSectionTitle}>6.1. Principes généraux</Text>
          <Text style={styles.paragraph}>
            Le RTC s'engage à mettre en oeuvre un ensemble de mesures technologiques,
            organisationnelles, humaines, physiques, juridiques et éthiques afin d'assurer la sécurité des
            renseignements personnels ou confidentiels qu'il détient, notamment en s'assurant des
            éléments suivants :{'\n'}
            • La disponibilité des renseignements de façon à ce qu'ils soient accessibles, au moment
            convenu et de la manière requise, par les personnes autorisées à y avoir accès;{'\n'}
            • L'intégrité des renseignements, de manière à ce que ceux-ci ne soient pas détruits ou
            altérés, de quelque façon, sans autorisation et en respect du calendrier de conservation du
            RTC, et que le support de ces renseignements leur procure la stabilité et la pérennité
            voulues;{'\n'}
            • La confidentialité des renseignements personnels ou confidentiels, en limitant leur
            divulgation aux seules personnes autorisées à en prendre connaissance;{'\n'}
            • L'identification et l'authentification, de façon à confirmer, lorsque requis, l'identité
            d'une personne ou l'identification d'un document ou d'un dispositif;{'\n'}
            • L'irrévocabilité, afin d'assurer qu'une action, un échange ou un document est clairement
            attribué à l'entité qui l'a généré;{'\n'}
            • La conformité aux exigences légales, réglementaires ou d'affaires auxquelles le RTC est
            assujetti.
          </Text>

          <Text style={styles.subSectionTitle}>6.2. Principes applicables aux renseignements confidentiels</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.2.1 Consentement à la collecte</Text>{'\n'}
            La collecte de renseignements confidentiels par le RTC doit s'effectuer en toute
            transparence, avec le consentement libre et éclairé de la personne concernée et en indiquant
            clairement les fins pour lesquelles ces renseignements sont recueillis.{'\n'}
            Le RTC devra obtenir un nouveau consentement pour utiliser les renseignements confidentiels à
            des fins qui ne sont pas compatibles avec celles pour lesquelles ils ont été recueillis.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.2.2 Conservation</Text>{'\n'}
            Tous les renseignements confidentiels collectés, quel que soit leur support, sont conservés
            dans un environnement sécurisé.{'\n'}
            Ces renseignements sont accessibles uniquement aux employés ou mandataires du RTC qui en ont
            nécessairement besoin pour l'exercice de leurs fonctions et ces derniers sont tenus de
            respecter le caractère confidentiel de ces renseignements.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.2.3 Communication à des tiers</Text>{'\n'}
            Le RTC requiert le consentement de la personne concernée avant de communiquer à un tiers un
            renseignement confidentiel lui appartenant, à moins que les lois applicables en autorisent la
            communication sans ce consentement.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.2.4 Destruction</Text>{'\n'}
            Les renseignements confidentiels sont conservés pour la période nécessaire à la réalisation des
            fins prévues par leur collecte et, par la suite, sont détruits dans les délais prévus au
            calendrier de conservation du RTC.
          </Text>

          <Text style={styles.subSectionTitle}>6.3. Principes applicables aux renseignements personnels</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.1 Consentement à la collecte</Text>{'\n'}
            La collecte de renseignements personnels par le RTC doit s'effectuer en toute transparence et
            avec le consentement libre et éclairé de la personne concernée.{'\n'}
            En respect des lois applicables, lorsque le RTC recueille des renseignements personnels, il
            indique clairement les fins pour lesquelles ces renseignements sont recueillis et requiert le
            consentement de la personne concernée pour en faire usage. Si la personne auprès de laquelle
            des renseignements personnels sont recueillis est mineure, le consentement doit être donné
            par son parent ou son tuteur.{'\n'}
            Le RTC devra obtenir un nouveau consentement pour utiliser les renseignements personnels à des
            fins qui ne sont pas compatibles avec celles pour lesquelles ils ont été recueillis.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.2 Limite à la collecte de renseignements personnels</Text>{'\n'}
            En respect des lois applicables, le RTC s'engage à recueillir uniquement les renseignements
            personnels nécessaires pour :{'\n'}
            • fournir le service demandé;{'\n'}
            • l'exercice de ses attributions ou de celles d'un organisme public avec lequel il collabore
            pour la prestation de services ou pour la réalisation d'une mission commune;{'\n'}
            • la mise en oeuvre d'un programme dont il a la gestion ou de celui d'un organisme public avec
            lequel il collabore pour la prestation de services ou pour la réalisation d'une mission
            commune.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.3 Mode de collecte</Text>{'\n'}
            La collecte de renseignements personnels peut s'effectuer notamment par l'entremise de
            formulaires, de différents moyens technologiques (par exemple, les réseaux sociaux ou des
            applications du RTC), d'entretiens téléphoniques, de sondages d'opinion ou de questionnaires.
            {'\n\n'}
            Toute personne qui recueille, au nom du RTC, des renseignements personnels auprès de la
            personne concernée ou d'un tiers, doit s'identifier et fournir notamment les informations
            suivantes :{'\n'}
            • le nom du RTC;{'\n'}
            • les fins pour lesquelles ces renseignements sont recueillis;{'\n'}
            • les catégories de personnes qui auront accès à ces renseignements;{'\n'}
            • le caractère obligatoire ou facultatif de la demande;{'\n'}
            • les conséquences pour la personne concernée ou, selon le cas, pour le tiers, d'un refus de
            répondre à la demande;{'\n'}
            • les droits d'accès et de rectification.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.4 Conservation</Text>{'\n'}
            Tous les renseignements personnels collectés, quel que soit leur support, sont conservés
            dans un environnement sécurisé.{'\n'}
            Ces renseignements sont accessibles uniquement aux employés ou mandataires du RTC qui en ont
            nécessairement besoin pour l'exercice de leurs fonctions et ces derniers sont tenus de
            respecter le caractère confidentiel de ces renseignements.{'\n'}
            Le RTC doit veiller à ce que les renseignements personnels qu'il conserve soient à jour,
            exacts et complets dans le but de servir aux fins pour lesquelles ils ont été recueillis.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.5 Finalités de la collecte</Text>{'\n'}
            Lorsque le RTC collecte et conserve des renseignements personnels, son objectif est d'offrir
            un service personnalisé et sécuritaire à ses clients, dans le respect des lois applicables et
            des règles de sécurité.{'\n'}
            Ainsi, le RTC utilisera les renseignements personnels recueillis notamment pour les fins
            suivantes :{'\n'}
            • vérifier l'identité d'un client;{'\n'}
            • assurer la protection du client et celle du RTC contre la fraude et les fausses
            déclarations;{'\n'}
            • offrir une prestation de services personnalisée;{'\n'}
            • déterminer l'admissibilité aux tarifs privilégiés offerts par le RTC;{'\n'}
            • suivre les requêtes de service auprès du RTC ou de ses mandataires, le cas échéant;{'\n'}
            • assurer le suivi des plaintes adressées au RTC;{'\n'}
            • communiquer de l'information, aux clients qui le souhaitent, sur les services offerts;
            {'\n'}
            • utiliser les données à des fins statistiques, élaborer des modèles prévisionnels, prendre
            des mesures et définir des profils;{'\n'}
            • améliorer les services offerts.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.6 Communication à des tiers</Text>{'\n'}
            Le RTC requiert le consentement de la personne concernée avant de communiquer à un tiers un
            renseignement personnel la concernant, à moins que les lois applicables en autorisent la
            communication sans ce consentement.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.7 Droits d'accès, de rectification ou de retrait</Text>{'\n'}
            Toute personne qui en fait la demande a droit d'accès aux renseignements personnels qui la
            concernent et qui sont détenus par le RTC, à moins d'exceptions prévues aux lois
            applicables.{'\n'}
            Une personne peut demander que ses renseignements personnels soient corrigés, détruits ou qu'ils
            ne soient plus utilisés pour les fins pour lesquelles ils ont été recueillis.{'\n'}
            En conformité avec les lois applicables, le RTC s'engage à respecter toute demande de
            rectification, de retrait ou de destruction, à moins d'obligations légales à l'effet
            contraire.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.8 Destruction</Text>{'\n'}
            Les renseignements personnels sont conservés pour la période nécessaire à la réalisation des
            fins prévues par leur collecte et, par la suite, sont détruits dans les délais prévus au
            calendrier de conservation du RTC.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6.3.9 Gestion des plaintes</Text>{'\n'}
            Toute personne qui désire déposer une plainte concernant la collecte, la conservation,
            l'utilisation, la communication, la destruction ou les droits d'accès ou de rectification à ses
            renseignements personnels par le RTC doit adresser celle-ci au responsable de l'accès aux
            documents et de la protection des renseignements personnels du RTC.
          </Text>

          <Text style={styles.subSectionTitle}>6.4. Sécurité des renseignements</Text>
          <Text style={styles.paragraph}>
            Le RTC utilise les technologies de l'information pour supporter ses processus d'affaires afin
            d'offrir une meilleure prestation de services.{'\n'}
            Le RTC met en place des mesures de sécurité et de gestion des accès adéquates pour assurer la
            confidentialité, l'intégrité et la disponibilité des renseignements qu'il détient en fonction
            de la sensibilité de ces renseignements, des risques auxquels ils sont exposés et des
            obligations auxquelles le RTC est soumis.
          </Text>

          <Text style={styles.subSectionTitle}>6.5. Responsabilité de l'utilisateur</Text>
          <Text style={styles.paragraph}>
            Toute personne qui achemine des renseignements au RTC est responsable de l'exactitude de
            ceux-ci ainsi que du maintien de la confidentialité de ses renseignements d'identification et
            d'authentification (code d'utilisateur, code d'accès, mot de passe, numéro de carte OPUS,
            etc.). Le RTC ne peut être tenu responsable d'un usage non autorisé causé par cet
            utilisateur.{'\n\n'}
            Toute personne qui achemine des renseignements au RTC doit également s'assurer que le système
            ou l'équipement avec lequel il transmet ou reçoit de l'information du RTC est suffisamment
            sécuritaire et faire preuve de vigilance. Le RTC ne peut être tenu responsable d'un accès non
            autorisé à des renseignements découlant d'une négligence ou des vulnérabilités présentes sur
            l'équipement ou le système d'un utilisateur.{'\n\n'}
            Dans l'éventualité où la confidentialité de ses renseignements venait à être compromise ou son
            identité usurpée, l'utilisateur est tenu d'en aviser le RTC le plus rapidement possible.
          </Text>

          <Text style={styles.subSectionTitle}>6.6. Restrictions relatives à l'accès aux services</Text>
          <Text style={styles.paragraph}>
            Le RTC se réserve le droit, pour un motif raisonnable, en tout temps, de détruire le compte d'un
            utilisateur, et ce, à sa seule discrétion et sans préavis.{'\n\n'}
            Le RTC se réserve également le droit, pour un motif raisonnable, de restreindre ou suspendre
            l'accès d'un utilisateur aux applications offertes par le RTC, en tout ou en partie.{'\n\n'}
            Le RTC ne pourra être tenu responsable d'une telle restriction, suspension ou destruction.
          </Text>

          <Text style={styles.subSectionTitle}>6.7. Déclaration d'incident</Text>
          <Text style={styles.paragraph}>
            Le RTC s'engage à informer ses clients, partenaires d'affaires ou utilisateurs en cas d'incident
            affectant la protection de leurs renseignements personnels ou confidentiels. Il s'engage
            également à prendre les mesures requises pour diminuer les risques qu'un préjudice soit causé et
            éviter que de nouveaux incidents de même nature se produisent.
          </Text>

          <Text style={styles.subSectionTitle}>6.8. Lien vers d'autres sites Internet</Text>
          <Text style={styles.paragraph}>
            Le site Internet du RTC propose des hyperliens vers d'autres sites Internet. Les renseignements
            échangés sur ces sites ne sont pas assujettis à la présente politique, mais à celle du site
            externe.{'\n\n'}
            Le RTC n'est pas responsable du contenu de ces sites et ne peut être tenu responsable des
            dommages, de quelque nature qu'ils soient, découlant de la navigation ou de l'utilisation de ces
            sites.
          </Text>

          {/* Section 7 - 10 */}
          <Text style={styles.sectionTitle}>7. Annexes</Text>
          <Text style={styles.paragraph}>S. O.</Text>

          <Text style={styles.sectionTitle}>8. Responsable de l'application</Text>
          <Text style={styles.paragraph}>
            Le directeur général est responsable de l'application de la présente politique.
          </Text>

          <Text style={styles.sectionTitle}>9. Dispositions finales et mesures transitoires</Text>
          <Text style={styles.paragraph}>S. O.</Text>

          <Text style={styles.sectionTitle}>10. Entrée en vigueur</Text>
          <Text style={styles.paragraph}>
            La présente politique entrera en vigueur le jour de son adoption par le conseil
            d'administration du RTC.{'\n\n'}
            Le 31 octobre 2018.{'\n'}
            Stéphanie Deschênes, secrétaire générale{'\n\n'}
            <Text style={styles.linkText}>https://www.rtcquebec.ca/regles-relatives-la-confidentialite</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F3D87',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#0F3D87',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  logo: {
    width: 95,
    height: 36,
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    lineHeight: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headingBold: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  metaText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  marginTop: {
    marginTop: 12,
  },
  marginBottom: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  subSectionTitle: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  bold: {
    fontWeight: '700',
  },
  linkText: {
    color: '#0F3D87',
    textDecorationLine: 'underline',
  },
});
