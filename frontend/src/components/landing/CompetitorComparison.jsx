import { useTranslation } from 'react-i18next';
import { Container, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';

function CompetitorComparison() {
  const { t } = useTranslation();

  const rows = [
    { key: 'data_source', field: 'data' },
    { key: 'accuracy', field: 'accuracy' },
    { key: 'output', field: 'output' },
    { key: 'personalization', field: 'personalization' },
    { key: 'custom_formulation', field: 'custom' },
  ];

  const competitors = ['loreal', 'spotscan', 'eve'];

  return (
    <section className="competitor">
      <Container>
        <motion.header
          className="competitor__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="competitor__title">{t('competitor.title')}</h2>
          <p className="competitor__subtitle">{t('competitor.subtitle')}</p>
        </motion.header>

        <motion.div
          className="competitor__table-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Table className="competitor__table" hover>
            <thead>
              <tr>
                <th>{t('competitor.feature')}</th>
                <th>L&apos;Oréal Skin Genius</th>
                <th>Spotscan</th>
                <th>Eve M</th>
                <th className="competitor__highlight-header">
                  {t('competitor.us')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>
                    <strong>{t(`competitor.${row.key}`)}</strong>
                  </td>
                  {competitors.map((comp) => (
                    <td key={comp}>
                      {row.field === 'custom' ? (
                        <span
                          className={
                            t(`competitor.${comp}.${row.field}`).includes('❌')
                              ? 'competitor__cross'
                              : 'competitor__check'
                          }
                        >
                          {t(`competitor.${comp}.${row.field}`)}
                        </span>
                      ) : (
                        t(`competitor.${comp}.${row.field}`)
                      )}
                    </td>
                  ))}
                  <td className="competitor__highlight-col">
                    <strong>
                      {row.field === 'custom' ? (
                        <span className="competitor__check">
                          {t(`competitor.dermai.${row.field}`)}
                        </span>
                      ) : (
                        t(`competitor.dermai.${row.field}`)
                      )}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </motion.div>
      </Container>
    </section>
  );
}

export default CompetitorComparison;
