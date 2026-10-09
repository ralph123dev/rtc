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

export default function CguCgvScreen() {
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
        <Text style={styles.pageTitle}>Conditions générales{'\n'}d'utilisation</Text>

        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.headingBold}>CGV : Conditions générales de vente</Text>
          <Text style={styles.headingBold}>CGU : Conditions générales d’utilisation</Text>

          <Text style={[styles.headingBold, styles.marginTop]}>PROVINCE DE QUÉBEC</Text>
          <Text style={styles.headingBold}>RÉSEAU DE TRANSPORT DE LA CAPITALE</Text>
          <Text style={[styles.headingBold, styles.marginBottom]}>
            RÈGLEMENT NO 230 concernant les titres de transport du Réseau de transport de la
            Capitale (RTC) (modifié par les règlements nos 255, 265, 270, 286, 290, 321, 326, 344
            et 370)
          </Text>

          {/* Section I */}
          <Text style={styles.sectionTitle}>SECTION I – DÉFINITIONS</Text>
          <Text style={styles.paragraph}>
            1. Dans le présent règlement, à moins que le contexte n’indique un sens différent, on
            entend par :
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« 1 jour »</Text> : période de vingt-quatre (24) heures
            débutant à 4 h et se terminant à 4 h le jour suivant;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Abonnement Métropolitain »</Text> : titre de transport de
            type abonnement utilisé pour les services de transport collectif du RTC, de la ST LÉVIS,
            de la traverse Québec-Lévis opérée par la Société des traversiers du Québec;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Abonnement RTC »</Text> : titre de transport de type
            abonnement utilisé pour les services de transport collectif du RTC;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« AMT »</Text> : l’Agence métropolitaine de transport;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Autobus »</Text> : un autobus, un minibus, un taxi ou tout
            autre véhicule utilisé pour les services de transport régulier de personnes, par ou pour
            le RTC;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Congés scolaires »</Text> : du 24 décembre au 2 janvier
            inclusivement, de même que pendant la semaine de relâche du printemps des écoles
            primaires publiques, tel qu’approuvé par le président du RTC;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« CPCT »</Text> : une carte à puce commune transport sur
            laquelle est intégrée une puce pouvant contenir un ou des titres de transport reconnus
            valides au sens du présent règlement;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« CPO »</Text> : une carte à puce occasionnelle jetable sur
            laquelle est intégrée une puce pouvant contenir un ou des titres de transport reconnus
            valides au sens du présent règlement;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Dimanche »</Text> : jour pour lequel le service du dimanche
            est offert;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Préposé »</Text> :{'\n'}
            i) un employé ou un représentant du RTC;{'\n'}
            ii) une personne autorisée à agir comme inspecteur en vertu des dispositions des
            chapitres VI et VII de la Loi sur les sociétés de transport en commun (L.R.Q., c. S-
            30.01);
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« RTC »</Text> : le Réseau de transport de la Capitale (Société
            de transport de Québec);
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« RTL »</Text> : le Réseau de transport de Longueuil (Société de
            transport de Longueuil);
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Samedi »</Text> : jour pour lequel le service du samedi est
            offert;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« STAC »</Text> : le Service de transport adapté de la
            Capitale;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« STL »</Text> : la Société de transport de Laval;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« ST LÉVIS »</Text> : la Société de transport de Lévis;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« STM »</Text> : la Société de transport de Montréal;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Support » ou « support conforme »</Text> : support virtuel ou
            support matériel pour sa période de validité lorsqu’émis par le RTC, le RTL, la STL, la
            STM ou l’AMT en contrepartie des frais exigés;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Support matériel »</Text> : pièce de carton, de papier, de
            plastique (autre qu’une CPO ou une CPCT) ou autre sur laquelle est imprimé un titre de
            transport;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Support virtuel »</Text> : une CPCT ou une CPO;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Tarif »</Text> : tout tarif applicable tel qu’adopté par
            résolution du conseil d’administration du RTC conformément à la Loi, pour les divers
            titres de transport reconnus valides par le RTC pour l’utilisation de ses services de
            transport collectif;
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>« Usager des services de transport adapté »</Text> : une
            personne ayant été admise aux services de transport adaptés offerts par le RTC à la suite
            d’une décision du comité d’admission aux termes de la « Politique d’admissibilité au
            transport adapté » du ministère des Transports du Québec.
          </Text>

          {/* Section II */}
          <Text style={styles.sectionTitle}>SECTION II – CHAMP D’APPLICATION</Text>
          <Text style={styles.paragraph}>
            2. Le présent règlement établit les conditions au regard de la possession et de
            l’utilisation des titres de transport du RTC reconnus valides dans le cadre des services
            de transport collectif du RTC.
          </Text>

          {/* Section III */}
          <Text style={styles.sectionTitle}>SECTION III – DISPOSITIONS GÉNÉRALES</Text>
          <Text style={styles.paragraph}>
            3. Tout usager des autobus doit, selon le tarif applicable prévu par résolution du conseil
            d’administration du RTC et de la manière prévue, acquitter son droit de transport en
            payant au comptant ou en utilisant un titre de transport de type unitaire ou de type
            abonnement reconnu valide par le RTC.
          </Text>
          <Text style={styles.paragraph}>
            4. À moins d’indications à l’effet contraire, l’acquittement du droit de transport
            s’effectue au moment de monter dans l’autobus, de la manière prévue.
          </Text>
          <Text style={styles.paragraph}>
            5. Lorsque le droit de transport est acquitté au comptant, il n’y a aucune remise de
            monnaie.
          </Text>
          <Text style={styles.paragraph}>
            6. L’obligation d’acquitter son droit de transport prévu à l’article 3 ci-devant ne
            s’applique pas aux personnes suivantes, lesquelles voyagent gratuitement à bord des
            autobus :{'\n'}
            a) l’enfant de moins de six (6) ans, lorsqu’il est accompagné d’une personne en assurant
            la surveillance;{'\n'}
            b) en tout temps, un maximum de trois (3) enfants âgés de six (6) à douze (12) ans,
            lorsqu’ils sont accompagnés d’un adulte détenant un support conforme sur lequel est
            encodé ou imprimé un titre de transport valide, émis par le RTC;{'\n'}
            c) abrogé;{'\n'}
            d) l’accompagnateur d’une personne présentant son « laissez-passer accompagnateur » émis
            par le RTC, la ST LÉVIS, le RTL, la STL, la STM ou l’AMT, conformément aux conditions
            d’admissibilité à une telle carte;{'\n'}
            e) l’accompagnateur d’une personne présentant sa carte ou CPCT d’usager des services de
            transport adapté émis par le RTC, la ST LÉVIS, le RTL, la STL ou la STM ou en leur nom;
            {'\n'}
            f) une personne agissant à titre d’instructeur et un maximum de cinq (5) de ses élèves,
            dans le cadre de leurs activités d’apprentissage de l’utilisation des services du RTC,
            présentant son « laissez-passer moniteur » émis par le RTC;{'\n'}
            g) l’employé régulier ou retraité du RTC, de la ST LÉVIS, du RTL, de la STL, de la STM,
            de l’AMT ou du STAC présentant, selon le cas, sa CPCT d’employé ou sa CPCT d’employé
            retraité;{'\n'}
            h) l’employé régulier de la Société des traversiers du Québec, dont le lieu principal de
            travail est situé dans les villes de Québec ou Lévis, présentant une CPCT dont la puce
            est encodée à cette fin;{'\n'}
            i) les policiers en uniforme;{'\n'}
            j) la personne détenant un laissez-passer reconnu à cette fin par le RTC;{'\n'}
            k) un abonné actif d’un programme d’abonnement de la Société de transport de Montréal
            (STM) ayant complété au moins 12 mois d’abonnement en continue et pour la période où il
            demeure abonné au programme.
          </Text>
          <Text style={styles.paragraph}>
            7. Un usager doit, sur demande, pendant toute la durée de son déplacement, permettre à
            un préposé de vérifier la validité du support et, le cas échéant, de son titre de
            transport.
          </Text>
          <Text style={styles.paragraph}>
            8. Un support conforme ne peut être utilisé simultanément par plus d’un usager de manière
            à leur permettre, au moyen de ce seul support conforme, d’utiliser en même temps les
            services de transport collectif du RTC, sauf pour l’acquittement du droit de transport
            avec un titre de transport de type unitaire à tarif général encodé sur un support virtuel.
            {'\n\n'}
            Dans ce cas, le même support virtuel peut être utilisé par un maximum de trois (3)
            usagers si aucun titre de transport de type abonnement n’est encodé sur le support
            virtuel. Le chauffeur débite le nombre de titres de transport de type unitaire requis
            pour tous les usagers utilisant ledit support.{'\n\n'}
            Pour bénéficier du droit de correspondre encodé sur le support virtuel visé à la
            Sous-section 4 de la Section IV – Titres de transport, tous les usagers utilisant le
            même support virtuel doivent poursuivre leur déplacement ensemble.
          </Text>

          {/* Section IV */}
          <Text style={styles.sectionTitle}>SECTION IV – TITRES DE TRANSPORT</Text>
          <Text style={styles.subSectionTitle}>Sous-section 1 – Titres de transport de type unitaire</Text>
          <Text style={styles.paragraph}>
            9. Les titres de transport de type unitaire suivants sont reconnus valides, durant leur
            période de validité, lorsqu’émis par le RTC sur un support conforme et utilisés
            conformément à la réglementation et au tarif applicables :{'\n'}
            a) un droit de passage valide pour un déplacement;{'\n'}
            b) un droit de correspondre lorsqu’utilisé conformément à la sous-section 4;{'\n'}
            c) tout autre titre de transport de type unitaire que le RTC pourrait émettre contre le
            paiement du tarif prescrit ou tout autre titre reconnu par le RTC.
          </Text>

          <Text style={styles.subSectionTitle}>Sous-section 2 – Titres de transport de type abonnement</Text>
          <Text style={styles.paragraph}>
            10. Les titres de transport de type abonnement suivants sont reconnus valides, durant leur
            période de validité, lorsqu’émis par le RTC sur un support conforme et utilisés
            conformément à la réglementation et au tarif applicables :{'\n'}
            a) l’abonnement RTC émis par le RTC pour une durée déterminée (1 jour, 1 mois ou autre
            durée) par résolution du conseil d’administration du RTC pour un tarif donné;{'\n'}
            b) l’abonnement Métropolitain émis par le RTC ou la ST LÉVIS pour une durée déterminée
            (1 jour, 1 mois ou autre durée) par résolution du conseil d’administration du RTC;{'\n'}
            c) le titre « événement » émis par le RTC conformément aux directives du conseil
            d’administration est valide pour les dates ou périodes qui y sont précisées.{'\n'}
            d) tout autre titre de transport de type abonnement que le RTC pourrait émettre contre le
            paiement du tarif prescrit ou tout autre titre reconnu par le RTC.
          </Text>
          <Text style={styles.paragraph}>
            11. Un titre de transport de type abonnement, sur support conforme, confère à son
            détenteur ou titulaire le droit d’utiliser, de façon illimitée, les services de transport
            collectif du RTC pour sa période de validité et selon les conditions du titre de
            transport.
          </Text>

          <Text style={styles.subSectionTitle}>Sous-section 3 – Autres titres</Text>
          <Text style={styles.bold}>Laissez-passer et titres spéciaux</Text>
          <Text style={styles.paragraph}>
            12. Le RTC se réserve, en tout temps, le droit de créer et d’émettre, sous tout support
            conforme, un ou des laissez-passer ainsi qu’un ou des titres de transport spéciaux
            conférant à leur détenteur certains privilèges de transport qu’il détermine. Ces
            laissez-passer ou titres spéciaux sont assimilés à des titres de transport de type
            unitaire et n’ont aucune valeur nominale.
          </Text>
          <Text style={styles.paragraph}>
            13. Pour constituer un titre de transport valide au sens du présent règlement, ces
            laissez-passer ou titres spéciaux doivent être utilisés conformément aux conditions
            d’utilisation applicables à leur égard.
          </Text>

          <Text style={styles.subSectionTitle}>Sous-section 4 – Droit de correspondre</Text>
          <Text style={styles.paragraph}>
            14. L’usager des services d’autobus obtient le droit de correspondre lorsque, selon le
            tarif applicable, il acquitte son droit de transport en payant au comptant ou au moyen
            d’un titre de transport de type unitaire émis par le RTC. Il est intégré au support
            virtuel si le droit de transport a été acquitté avec un titre de transport encodé sur un
            support virtuel. Dans les autres cas, il est imprimé sur un support matériel. La date, le
            circuit et l’heure d’expiration sont alors imprimés ou poinçonnés par le chauffeur sur le
            support matériel sur lequel il est émis.
          </Text>
          <Text style={styles.paragraph}>
            15. Un droit de correspondre permet de monter gratuitement à bord de tout autobus circulant
            sur un parcours autre que celui sur lequel il a été émis et autre que ceux utilisés durant
            sa période de validité.
          </Text>
          <Text style={styles.paragraph}>
            16. L’acquittement d’un droit de transport, au moyen d’un droit de correspondre, doit
            s’effectuer à l’intérieur d’un délai de quatre-vingt-dix (90) minutes à compter de son
            émission.
          </Text>
          <Text style={styles.paragraph}>
            17. Le droit de correspondre, émis sur un support matériel, doit être demandé au
            chauffeur au moment d’acquitter son droit de transport.
          </Text>
          <Text style={styles.paragraph}>
            18. Le détenteur d’un droit de correspondre valide, contenu sur un support virtuel, ne peut
            réclamer un droit de correspondre sur support matériel.
          </Text>
          <Text style={styles.paragraph}>
            19. Un droit de correspondre est incessible, ne comporte aucune valeur nominale et demeure,
            en tout temps, la propriété du RTC.
          </Text>

          {/* Section V */}
          <Text style={styles.sectionTitle}>SECTION V – TARIFS AUTRES QUE « GÉNÉRAL »</Text>
          <Text style={styles.paragraph}>
            20. Pour bénéficier de tout tarif autre que général, un usager doit, au moment
            d’acquitter son droit de transport, être titulaire, détenir et présenter au chauffeur une
            CPCT :{'\n'}
            a) sur laquelle est encodé un titre de transport valide au tarif approprié à sa
            catégorie;{'\n'}
            ou b) qui est accompagnée d’un titre de transport de type unitaire valide au tarif
            approprié à sa catégorie, sur support matériel;{'\n'}
            et sur laquelle est apposée sa photo.
          </Text>
          <Text style={styles.paragraph}>21. Abrogé.</Text>
          <Text style={styles.paragraph}>
            22. Le RTC accorde à la personne admissible, selon l’article 24, le privilège de
            bénéficier du tarif autre que général applicable à sa catégorie pour l’utilisation de ses
            services de transport collectif, lorsqu’un tel tarif est adopté par le conseil
            d’administration pour sa catégorie pour le titre de transport visé. Ce privilège est
            applicable tant que cette personne conserve le statut associé à cette catégorie.
          </Text>
          <Text style={styles.paragraph}>
            23. Pour bénéficier du privilège mentionné à l’article 22, la personne admissible, selon
            l’article 24, doit, moyennant paiement des frais exigés et pour la période d’usage qui y
            sera prescrite, obtenir du RTC ou de toute personne duly autorisée par ce dernier, selon
            le cas, une CPCT encodée en fonction de sa catégorie d’admissibilité, sur laquelle est
            apposée sa photographie.
          </Text>
          <Text style={styles.paragraph}>
            24. Est admissible au privilège mentionné à l’article 22, une personne qui fait la preuve
            de son statut, à la satisfaction du RTC, selon sa catégorie :{'\n\n'}
            <Text style={styles.bold}>Catégorie / Statut</Text>
            {'\n'}
            <Text style={styles.bold}>« 65 ans et plus »</Text> : personne âgée de soixante-cinq (65)
            ans et plus;{'\n'}
            <Text style={styles.bold}>« 18 ans et moins »</Text> : personne âgée de 18 ans et moins au
            30 septembre de l’année en cours;{'\n'}
            <Text style={styles.bold}>« étudiant plus »</Text> : personne inscrite comme étudiant à
            temps plein au sens de l’article 9 du premier alinéa de l’article 10 de la Loi sur l’aide
            financière aux études (L.R.Q., c. A-13-3), dans une école ou une institution ou un
            programme d’enseignement reconnu par le ministère de l’Éducation du Québec ou autre
            école, institution ou programme reconnu par résolution du conseil d’administration du
            RTC;{'\n'}
            <Text style={styles.bold}>« privilège Métropolitain »</Text> : personne âgée de 23 ans et
            moins au 30 septembre de l’année en cours;{'\n\n'}
            Pour continuer de bénéficier du tarif de la catégorie « étudiant plus », la preuve du
            statut doit être refaite à chaque année, avant le 30 septembre. De même, ce statut peut
            être vérifié en tout temps pendant l’année par le RTC.
          </Text>
          <Text style={styles.paragraph}>
            25. Une CPCT, sur laquelle est apposée la photographie de son titulaire, est strictement
            personnelle et ne peut être utilisée par une autre personne, sauf si son détenteur acquitte
            son droit de transport avec un titre de transport à tarif général encodé sur cette CPCT. Il
            en est de même pour tout titre de transport ou laissez-passer, sur support matériel, à
            tarif autre que général.
          </Text>

          {/* Section VI */}
          <Text style={styles.sectionTitle}>SECTION VI – INTERDICTIONS</Text>
          <Text style={styles.paragraph}>
            26. À moins d’autorisation du RTC, il est interdit :{'\n'}
            a) de permettre, avec ou sans contrepartie, dans le cadre de ses activités commerciales,
            l’utilisation d’un titre de transport ou d’un support conforme;{'\n'}
            b) de vendre ou de tenter de vendre tout titre de transport ou support conforme;{'\n'}
            c) de louer ou de tenter de louer tout titre de transport;{'\n'}
            d) d’accepter ou d’utiliser un titre de transport ou un support conforme obtenu en
            contravention des paragraphes a), b) ou c) du présent article;{'\n'}
            e) d’utiliser un titre de transport qui n’a pas été émis en contrepartie du paiement du
            tarif applicable;{'\n'}
            f) d’utiliser un support conforme qui n’a pas été émis en contrepartie du paiement des
            frais exigés.
          </Text>
          <Text style={styles.paragraph}>
            27. Il est interdit :{'\n'}
            a) d’obtenir ou de tenter d’obtenir sans droit un titre de transport ou un support
            conforme;{'\n'}
            b) de falsifier, de modifier, d’altérer ou de reproduire un titre de transport ou un
            support conforme;{'\n'}
            c) d’utiliser ou de tenter d’utiliser un titre de transport ou support conforme falsifié,
            modifié, altéré ou reproduit;{'\n'}
            d) d’utiliser ou de tenter d’utiliser un titre de transport ou un support conforme
            périmé, suspendu ou annulé;{'\n'}
            e) d’obtenir plus d’un droit de correspondre par usager.
          </Text>
          <Text style={styles.paragraph}>
            28. Il est interdit d’obtenir ou de tenter d’obtenir un déplacement sans en avoir
            acquitté le droit de transport de la façon prévue à l’article 3.
          </Text>
          <Text style={styles.paragraph}>
            29. Il est interdit de transférer, prêter ou céder une CPCT sur laquelle apparaît la photo
            de son titulaire, sauf si son détenteur acquitte son droit de transport avec un titre de
            transport à tarif général encodé sur cette CPCT.
          </Text>
          <Text style={styles.paragraph}>
            30. Il est interdit à toute personne d’utiliser, sans droit, un titre de transport ou un
            support conforme.
          </Text>
          <Text style={styles.paragraph}>
            31. Tout titre de transport ou support conforme vendu par un préposé ou un consignataire,
            expressément autorisé à cette fin, ne peut l’être que dans sa forme originale ainsi qu’au
            tarif ou frais, selon le cas, déterminés par le RTC.
          </Text>

          {/* Section VII */}
          <Text style={styles.sectionTitle}>SECTION VII – DISPOSITIONS PÉNALES</Text>
          <Text style={styles.paragraph}>
            32. Quiconque contrevient à l’article 27e) du présent règlement commet une infraction et
            est passible d’une amende de 75 $ à 500 $.
          </Text>
          <Text style={styles.paragraph}>
            33. Quiconque contrevient à l’un des articles 3, 27a), 27d), 28, 29 ou 30 du présent
            règlement commet une infraction et est passible d’une amende de 150 $ à 500 $ dans le cas
            d’une personne physique et de 300 $ à 1 000 $ dans le cas d’une personne morale.
          </Text>
          <Text style={styles.paragraph}>
            34. Quiconque contrevient à l’un des articles 26, 27c) ou 31 du présent règlement commet
            une infraction et est passible d’une amende de 175 $ à 500 $ dans le cas d’une personne
            physique et de 350 $ à 1 000 $ dans le cas d’une personne morale.
          </Text>
          <Text style={styles.paragraph}>
            35. Quiconque contrevient à l’article 27b) du présent règlement commet une infraction et
            est passible d’une amende de 200 $ à 500 $ dans le cas d’une personne physique et de 400 $
            à 1 000 $ dans le cas d’une personne morale.
          </Text>
          <Text style={styles.paragraph}>
            36. Quiconque contrevient à toute autre disposition du présent règlement commet une
            infraction et est passible d’une amende de 75 $ à 500 $ dans le cas d’une personne
            physique et de 300 $ à 1 000 $ dans le cas d’une personne morale.
          </Text>
          <Text style={styles.paragraph}>
            37. Si une même personne enfreint plus d’une fois, dans une période de vingt-quatre (24)
            mois, une même disposition du présent règlement, les montants d’amendes prévus pour cette
            infraction sont portés au double.
          </Text>
          <Text style={styles.paragraph}>
            38. Une personne qui conseille, encourage ou incite une autre personne à faire un acte
            qui constitue une infraction au présent règlement ou qui accomplit ou omet d’accomplir une
            chose ayant pour effet d’aider une autre personne à commettre une infraction est partie
            à cette infraction et est passible de la même peine que celle qui est prévue pour le
            contrevenant, que celui-ci ait été ou non poursuivi ou déclaré coupable.
          </Text>

          {/* Section VIII */}
          <Text style={styles.sectionTitle}>SECTION VIII – DISPOSITIONS DIVERSES</Text>
          <Text style={styles.subSectionTitle}>Sous-section 1 – Dispositions résiduelles</Text>
          <Text style={styles.paragraph}>
            39. Sous réserve des directives émises à ce sujet par le conseil d’administration du
            RTC, les titres de transport ou supports conformes visés au présent règlement ne peuvent
            faire l’objet d’aucun échange ou remboursement.
          </Text>
          <Text style={styles.paragraph}>
            40. Le RTC peut modifier, annuler ou révoquer, en tout temps, les conditions
            d’utilisation de ses titres de transport ainsi que des supports conformes.
          </Text>
          <Text style={styles.paragraph}>
            41. Au moment d’acquitter son droit de transport ou lors de l’achat d’un titre de
            transport ou d’un support conforme, l’usager doit s’assurer de l’exactitude de la
            transaction. S’il constate une erreur à ce moment, l’usager doit immédiatement aviser le
            préposé ou le consignataire, selon le cas, pour obtenir la correction nécessaire.
          </Text>
          <Text style={styles.paragraph}>
            42. Toute autorisation requise en vertu du présent règlement, à l’exception de celle
            découlant d’une entente avec le RTC, peut être donnée par le directeur général du RTC
            suivant les directives émises par le conseil d’administration du RTC à cet égard.
          </Text>
          <Text style={styles.paragraph}>
            43. Suivant les directives émises par le conseil d’administration du RTC, le directeur
            général a toute l’autorité nécessaire pour accorder, le cas échéant, tout rabais, escompte
            ou autre privilège lors de l’émission, de la vente ou de l’utilisation de tout titre de
            transport, support conforme ou autre document visé par le présent règlement.
          </Text>
          <Text style={styles.paragraph}>
            44. Rien dans le présent règlement ne peut s’interpréter comme limitant le droit ou le
            pouvoir du conseil d’administration du RTC d’accorder, à l’égard d’une catégorie
            d’individus ou à l’égard d’un titre de transport, des privilèges de transport collectif
            autres que ceux qui y sont expressément prévus.
          </Text>
          <Text style={styles.paragraph}>
            45. Le présent règlement n’a pas pour effet de limiter l’application de toute autre
            disposition législative ou réglementaire à laquelle peut être assujettie une personne.
          </Text>

          <Text style={styles.subSectionTitle}>Sous-section 2 – Renvois</Text>
          <Text style={styles.paragraph}>
            46. Les renvois faits dans le présent règlement doivent, à moins d’indication contraire,
            être lus en tenant compte des modifications qui pourront être apportées au texte des
            dispositions législatives et réglementaires auxquelles il est fait ainsi renvoi.
          </Text>

          <Text style={styles.subSectionTitle}>Sous-section 3 – Responsabilité de l’application du règlement</Text>
          <Text style={styles.paragraph}>
            47. Les personnes autorisées à agir comme inspecteurs, en vertu des dispositions des
            chapitres VI et VII de la Loi sur les sociétés de transport en commun.
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
  marginTop: {
    marginTop: 16,
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
});
