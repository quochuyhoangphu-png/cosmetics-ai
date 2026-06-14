import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { BiNetworkChart, BiKey, BiBrain, BiShield } from 'react-icons/bi';
import { FaFlask } from 'react-icons/fa';

function AgentPipeline({ agentSteps }) {
  const { t } = useTranslation();

  // Map backend agent keys to icons, names and descriptions
  const agentMetadata = {
    orchestrator: {
      name: t('agents.orchestrator'),
      desc: t('agents.orchestrator_desc'),
      icon: <BiNetworkChart />,
      color: '#c8274e', // Primary Rose Gold
      bg: 'rgba(200, 39, 78, 0.1)'
    },
    extraction: {
      name: t('agents.extraction'),
      desc: t('agents.extraction_desc'),
      icon: <BiKey />,
      color: '#1abc9c', // Teal
      bg: 'rgba(26, 188, 156, 0.1)'
    },
    planning: {
      name: t('agents.planning'),
      desc: t('agents.planning_desc'),
      icon: <BiBrain />,
      color: '#9966cc', // Soft Violet
      bg: 'rgba(153, 102, 204, 0.1)'
    },
    formulation: {
      name: t('agents.formulation'),
      desc: t('agents.formulation_desc'),
      icon: <FaFlask />,
      color: '#e67e22', // Warm Orange/Gold
      bg: 'rgba(230, 126, 34, 0.1)'
    },
    review: {
      name: t('agents.review'),
      desc: t('agents.review_desc'),
      icon: <BiShield />,
      color: '#2ecc71', // Green
      bg: 'rgba(46, 204, 113, 0.1)'
    }
  };

  // Define fallback steps if API doesn't return them
  const defaultSteps = [
    { agent: 'orchestrator', status: 'complete', processingTimeMs: 120 },
    { agent: 'extraction', status: 'complete', processingTimeMs: 450 },
    { agent: 'planning', status: 'complete', processingTimeMs: 310 },
    { agent: 'formulation', status: 'complete', processingTimeMs: 520 },
    { agent: 'review', status: 'complete', processingTimeMs: 180 }
  ];

  const stepsToRender = agentSteps && agentSteps.length > 0 ? agentSteps : defaultSteps;

  return (
    <div className="agent-pipeline py-3">
      <Card className="dashboard__card border-0 shadow-sm p-4 mb-4">
        <Card.Body>
          <div className="mb-4 pb-3 border-bottom border-light">
            <h3 className="dashboard__section-title mb-1">
              {t('dashboard.agents_title')}
            </h3>
            <p className="dashboard__section-subtitle text-muted mb-0">
              {t('dashboard.agents_desc')}
            </p>
          </div>

          <Row className="justify-content-between align-items-center g-3">
            {stepsToRender.map((step, idx) => {
              const meta = agentMetadata[step.agent] || {
                name: step.agent,
                desc: 'AI Process Step',
                icon: <BiNetworkChart />,
                color: '#6c757d',
                bg: '#f8f9fa'
              };

              const isComplete = step.status === 'complete';
              const isProcessing = step.status === 'processing';

              return (
                <React.Fragment key={idx}>
                  <Col xs={12} md={2} className="text-center">
                    <Card
                      className="border-0 p-3 h-100 shadow-sm rounded-lg d-flex flex-column align-items-center"
                      style={{
                        backgroundColor: meta.bg,
                        borderTop: `4px solid ${meta.color}`,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white mb-2 fs-3"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: meta.color,
                          boxShadow: `0 4px 10px ${meta.color}30`
                        }}
                      >
                        {meta.icon}
                      </div>
                      <h5 className="fs-6 fw-bold mb-1" style={{ color: meta.color }}>
                        {meta.name}
                      </h5>
                      <span className="text-muted d-block small mb-2" style={{ fontSize: '0.72rem', lineHeight: '1.2' }}>
                        {meta.desc}
                      </span>
                      <div className="mt-auto">
                        <Badge
                          bg={isComplete ? 'success' : isProcessing ? 'warning' : 'secondary'}
                          className="px-2.5 py-1.5"
                          style={{ fontSize: '0.65rem' }}
                        >
                          {isComplete
                            ? `${step.processingTimeMs}ms`
                            : isProcessing
                            ? t('agents.processing')
                            : t('agents.pending')}
                        </Badge>
                      </div>
                    </Card>
                  </Col>

                  {idx < stepsToRender.length - 1 && (
                    <Col md={1} className="d-none d-md-flex justify-content-center text-muted fs-4">
                      <span className="animate-pulse">➔</span>
                    </Col>
                  )}
                </React.Fragment>
              );
            })}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AgentPipeline;
